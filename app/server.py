from dotenv import load_dotenv
import os
import shutil
import logging
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from typing import List
from pathlib import Path

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()

# Создаем папки при старте, если их нет
Path("public/pictures").mkdir(parents=True, exist_ok=True)
Path("public/videos").mkdir(parents=True, exist_ok=True)

# Монтируем статику
app.mount("/pictures", StaticFiles(directory="public/pictures"), name="pictures")
app.mount("/videos", StaticFiles(directory="public/videos"), name="videos")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

api_router = APIRouter(prefix="/api")

# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------- Models ----------
class LoginInput(BaseModel):
    email: EmailStr
    password: str

class PasswordChangeSchema(BaseModel):
    old_password: str
    new_password: str

class CreateUserSchema(BaseModel):
    email: EmailStr
    password: str
    name: str = "Staff"
    role: str = "admin"

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_uk: str
    name_ro: str
    description_en: str = ""
    description_uk: str = ""
    description_ro: str = ""
    duration: str = "60"
    price: str = "0"
    image_url: str = ""
    category: str = "massage"
    active: bool = True

class ServiceInput(BaseModel):
    name_en: str
    name_uk: str
    name_ro: str
    description_en: str = ""
    description_uk: str = ""
    description_ro: str = ""
    duration: str = "60"
    price: str = "0"
    image_url: str = ""
    category: str = "massage"
    active: bool = True

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str = ""
    service_id: str = ""
    service_name: str = ""
    date: str
    time: str
    notes: str = ""
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BookingInput(BaseModel):
    name: str
    phone: str
    email: str = ""
    service_id: str = ""
    service_name: str = ""
    date: str
    time: str
    notes: str = ""

class BookingStatusInput(BaseModel):
    status: str

# ---------- Auth routes ----------
@api_router.post("/auth/login")
async def login(data: LoginInput):
    email = data.email.lower()
    logger.info(f"LOGIN: Attempting login for {email}")
    user = await db.users.find_one({"email": email})
    logger.info(f"LOGIN: User found: {user is not None}")
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
    }

@api_router.post("/auth/change-password")
async def change_password(data: PasswordChangeSchema, current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["id"]})
    if not user or not verify_password(data.old_password, user['password_hash']):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    await db.users.update_one({"id": current_user["id"]}, {"$set": {"password_hash": hash_password(data.new_password)}})
    return {"ok": True}

@api_router.post("/auth/create-user")
async def create_user(data: CreateUserSchema, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")
    
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = {
        "id": str(uuid.uuid4()),
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "name": data.name,
        "role": data.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(new_user)
    return {"ok": True, "user_id": new_user["id"]}

@api_router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user

# ---------- Service routes ----------
@api_router.get("/services", response_model=List[Service])
async def list_services():
    docs = await db.services.find({}, {"_id": 0}).to_list(1000)
    return [Service(**d) for d in docs]

@api_router.post("/services", response_model=Service)
async def create_service(data: ServiceInput, current_user: dict = Depends(get_current_user)):
    svc = Service(**data.model_dump())
    await db.services.insert_one(svc.model_dump())
    return svc

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, data: ServiceInput, current_user: dict = Depends(get_current_user)):
    existing = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    await db.services.update_one({"id": service_id}, {"$set": data.model_dump()})
    updated = {**existing, **data.model_dump()}
    return Service(**updated)

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.services.delete_one({"id": service_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}

# ---------- Booking routes ----------
@api_router.get("/bookings/slots")
async def get_booked_slots(date: str):
    cursor = db.bookings.find({"date": date, "status": "confirmed"}, {"time": 1, "_id": 0})
    bookings = await cursor.to_list(1000)
    return [b["time"] for b in bookings]

@api_router.post("/bookings", response_model=Booking)
async def create_booking(data: BookingInput):
    booking = Booking(**data.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(current_user: dict = Depends(get_current_user)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return [Booking(**d) for d in docs]

@api_router.patch("/bookings/{booking_id}", response_model=Booking)
async def update_booking_status(booking_id: str, data: BookingStatusInput, current_user: dict = Depends(get_current_user)):
    existing = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Booking not found")
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": data.status}})
    existing["status"] = data.status
    return Booking(**existing)

@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.bookings.delete_one({"id": booking_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    ext = file.filename.split('.')[-1].lower()
    folder = "videos" if ext in ["mp4", "mov", "avi", "mkv"] else "pictures"
    upload_dir = ROOT_DIR / "public" / folder
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/{folder}/{file.filename}"}

@api_router.get("/stats")
async def stats(current_user: dict = Depends(get_current_user)):
    total = await db.bookings.count_documents({})
    pending = await db.bookings.count_documents({"status": "pending"})
    confirmed = await db.bookings.count_documents({"status": "confirmed"})
    services = await db.services.count_documents({})
    return {"total_bookings": total, "pending": pending, "confirmed": confirmed, "services": services}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_SERVICES = [
    {"name_en": "Therapeutic back massage", "name_uk": "Терапевтичний масаж спини", "name_ro": "Masaj terapeutic al spatelui",
     "description_en": "A targeted therapeutic massage that relieves muscle tension, improves posture, and releases deep-seated stress in the back and shoulders.",
     "description_uk": "Цілеспрямований терапевтичний масаж, який знімає м'язову напругу, покращує поставу та звільняє від глибокого стресу в спині та плечах.",
     "description_ro": "Un masaj terapeutic țintit care ameliorează tensiunea musculară, îmbunătățește postura și eliberează stresul profund din spate și umeri.",
     "duration": "40", "price": "150", "category": "therapy", "image_url": "/videos/Therapeutic_back_massage.mp4"},
    {"name_en": "Therapeutic general massage", "name_uk": "Терапевтичний загальний масаж", "name_ro": "Masaj terapeutic general",
     "description_en": "A full-body therapeutic massage designed to restore energy, relieve chronic tension, and promote overall physical wellbeing.",
     "description_uk": "Загальний терапевтичний масаж усього тіла, який відновлює енергію, знімає хронічну напругу та сприяє загальному фізичному благополуччю.",
     "description_ro": "Un masaj terapeutic complet al corpului, conceput pentru a restabili energia, a reduce tensiunea cronică și a promova bunăstarea fizică generală.",
     "duration": "60", "price": "170", "category": "therapy", "image_url": "/videos/Therapeutic_general_massage.mp4"},
    {"name_en": "Lymphatic drainage massage", "name_uk": "Лімфодренажний масаж", "name_ro": "Masaj de drenaj limfatic",
     "description_en": "A gentle, rhythmic technique that stimulates the lymphatic system, reduces swelling, detoxifies the body, and boosts immunity.",
     "description_uk": "Ніжна ритмічна техніка, яка стимулює лімфатичну систему, зменшує набряки, виводить токсини та зміцнює імунітет.",
     "description_ro": "O tehnică blândă și ritmică care stimulează sistemul limfatic, reduce umflăturile, detoxifică organismul și crește imunitatea.",
     "duration": "60", "price": "170", "category": "therapy", "image_url": "/videos/Lymphatic_drainage_massage.mp4"},
    {"name_en": "Anti-cellulite massage (hardware, manual, combo)", "name_uk": "Антицелюлітний масаж (апаратний, ручний, комбо)", "name_ro": "Masaj anticelulitic (aparat, manual, combo)",
     "description_en": "An effective treatment that smooths the skin, reduces cellulite appearance, and improves body contours through combined techniques.",
     "description_uk": "Ефективна процедура, яка вирівнює шкіру, зменшує прояви целюліту та покращує контури тіла завдяки комбінованим технікам.",
     "description_ro": "Un tratament eficient care netezește pielea, reduce aspectul celulitei și îmbunătățește conturul corpului prin tehnici combinate.",
     "duration": "60", "price": "170", "category": "wellness", "image_url": "/videos/Anti-cellulite_massage_(hardware,_manual,_combo).mp4"},
    {"name_en": "Pressotherapy", "name_uk": "Пресотерапія", "name_ro": "Presoterapie",
     "description_en": "A relaxing compression therapy that enhances blood circulation, reduces fluid retention, and provides a feeling of lightness in the legs and body.",
     "description_uk": "Релаксуюча компресійна терапія, яка покращує кровообіг, зменшує затримку рідини та дарує відчуття легкості в ногах і тілі.",
     "description_ro": "O terapie relaxantă de compresie care îmbunătățește circulația sanguină, reduce retenția de lichide și oferă o senzație de ușurință în picioare și corp.",
     "duration": "60", "price": "150-170", "category": "wellness", "image_url": "/videos/Pressotherapy.mp4"},
    {"name_en": "Myostimulation", "name_uk": "Міостимуляція", "name_ro": "Miostimulare",
     "description_en": "Electrical muscle stimulation helps tone muscles, improve metabolism, and accelerate recovery.",
     "description_uk": "Електростимуляція м’язів допомагає підтягнути їх, покращити метаболізм та прискорити відновлення.",
     "description_ro": "Stimularea electrică a mușchilor ajută la tonifiere, îmbunătățirea metabolismului și accelerarea recuperării.",
     "duration": "30", "price": "150", "category": "wellness", "image_url": "/videos/Myostimulation.mp4"},
    {"name_en": "RF lifting (body, face)", "name_uk": "RF-ліфтинг (тіло, обличчя)", "name_ro": "Lifting RF (corp, față)",
     "description_en": "Advanced radiofrequency treatment that tightens skin, stimulates collagen production, and provides visible lifting and rejuvenation effects.",
     "description_uk": "Сучасна радіочастотна процедура, яка підтягує шкіру, стимулює вироблення колагену та забезпечує помітний ліфтинг і омолодження.",
     "description_ro": "Un tratament avansat cu radiofrecvență care strânge pielea, stimulează producția de colagen și oferă efecte vizibile de lifting și rejuvenare.",
     "duration": "30", "price": "170", "category": "wellness", "image_url": "/videos/RF_lifting_(body,_face).mp4"},
    {"name_en": "Back massage + vacuum therapy", "name_uk": "Масаж спини + вакуумна терапія", "name_ro": "Masaj de spate + terapie cu vid",
     "description_en": "A powerful combination of deep tissue massage and vacuum therapy that effectively relieves back pain and improves skin elasticity.",
     "description_uk": "Потужне поєднання глибокого масажу та вакуумної терапії, яке ефективно знімає біль у спині та покращує еластичність шкіри.",
     "description_ro": "O combinație puternică de masaj profund și terapie cu vid care ameliorează eficient durerea de spate și îmbunătățește elasticitatea pielii.",
     "duration": "60", "price": "150", "category": "therapy", "image_url": "/videos/Back_massage_+_vacuum_therapy.mp4"},
    {"name_en": "Facial massage + alginate mask", "name_uk": "Масаж обличчя + альгінатна маска", "name_ro": "Masaj facial + mască alginată",
     "description_en": "A luxurious facial treatment that combines relaxing massage with a nourishing alginate mask for deep hydration and glowing skin.",
     "description_uk": "Розкішний догляд за обличчям, який поєднує релаксуючий масаж з живильною альгінатною маскою для глибокого зволоження та сяйва шкіри.",
     "description_ro": "Un tratament facial luxuriant care combină masajul relaxant cu o mască alginată hrănitoare pentru hidratare profundă și piele radiantă.",
     "duration": "60", "price": "170", "category": "wellness", "image_url": "/videos/Facial_massage_+_alginate_mask.mp4"},
    {"name_en": "Baby massage", "name_uk": "Дитячий масаж", "name_ro": "Masaj pentru copii",
     "description_en": "A gentle and caring massage for babies that promotes healthy development, better sleep, and strengthens the bond between parent and child.",
     "description_uk": "Ніжний і дбайливий масаж для малюків, який сприяє здоровому розвитку, покращує сон та зміцнює зв'язок між батьками і дитиною.",
     "description_ro": "Un masaj blând și plin de grijă pentru bebeluși care promovează dezvoltarea sănătoasă, somnul mai bun și întărește legătura dintre părinte și copil.",
     "duration": "30", "price": "120", "category": "wellness", "image_url": "/videos/Baby_massage.mp4"},
    {"name_en": "Kinesiotaping", "name_uk": "Кінезіотейпування", "name_ro": "Kinesiotaping",
     "description_en": "Therapeutic taping technique that supports muscles and joints, reduces pain, and accelerates recovery without restricting movement.",
     "description_uk": "Терапевтична техніка тейпування, яка підтримує м'язи та суглоби, зменшує біль і прискорює відновлення, не обмежуючи рухів.",
     "description_ro": "Tehnică terapeutică de taping care susține mușchii și articulațiile, reduce durerea și accelerează recuperarea fără a restricționa mișcarea.",
     "duration": "30-45", "price": "100-150", "category": "therapy", "image_url": "/videos/Kinesiotaping.mp4"},
    {"name_en": "Face massage + back massage", "name_uk": "Масаж обличчя + масаж спини", "name_ro": "Masaj facial + masaj de spate",
     "description_en": "A harmonious combination of facial and back massage that provides complete relaxation and visible rejuvenation of the whole body.",
     "description_uk": "Гармонійне поєднання масажу обличчя та спини, яке дарує повне розслаблення та помітне омолодження всього тіла.",
     "description_ro": "O combinație armonioasă de masaj facial și de spate care oferă relaxare completă și rejuvenare vizibilă a întregului corp.",
     "duration": "100", "price": "280", "category": "wellness", "image_url": "/videos/Face_massage_+_back_massage.mp4"},
    {"name_en": "General massage + face massage", "name_uk": "Загальний масаж + масаж обличчя", "name_ro": "Masaj general + masaj facial",
     "description_en": "Complete relaxation for body and face in one session.",
     "description_uk": "Повне розслаблення тіла та обличчя в одному сеансі.",
     "description_ro": "Relaxare completă a corpului și feței într-o singură sesiune.",
     "duration": "120", "price": "300", "category": "wellness", "image_url": "/videos/General_massage_+_face_massage.mp4"},
    {"name_en": "Pressotherapy + face massage", "name_uk": "Пресотерапія + масаж обличчя", "name_ro": "Presoterapie + masaj facial",
     "description_en": "A wonderful combination of lymphatic drainage and facial massage that helps remove toxins and restore a fresh, radiant appearance.",
     "description_uk": "Чудове поєднання лімфодренажу та масажу обличчя, яке допомагає вивести токсини та повернути свіжий, сяючий вигляд.",
     "description_ro": "O combinație minunată de drenaj limfatic și masaj facial care ajută la eliminвання toxinelor și redă un aspect proaspăt și radiant.",
     "duration": "60", "price": "280", "category": "wellness", "image_url": "/videos/Pressotherapy_+_face_massage.mp4"},
]

@app.on_event("startup")
async def startup():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@familyhealth.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    logger.info(f"STARTUP: Проверяем админа {admin_email}")
    
    await db.users.create_index("email", unique=True)
    existing = await db.users.find_one({"email": admin_email})
    
    logger.info(f"STARTUP: Админ найден в базе: {existing is not None}")
    
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    for s in DEFAULT_SERVICES:
        exists = await db.services.find_one({"name_en": s["name_en"]})
        if not exists:
            svc = Service(**s)
            await db.services.insert_one(svc.model_dump())
            logger.info(f"Seeded service: {s['name_en']}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()