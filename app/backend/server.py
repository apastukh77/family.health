from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)


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


class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_uk: str
    name_ro: str
    description_en: str = ""
    description_uk: str = ""
    description_ro: str = ""
    duration: int = 60
    price: float = 0
    image_url: str = ""
    category: str = "massage"
    active: bool = True


class ServiceInput(BaseModel):
    name_en: str
    name_uk: str
    description_en: str = ""
    description_uk: str = ""
    duration: int = 60
    price: float = 0
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
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
    }


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
    updated = {**existing, **data.model_dump()}
    await db.services.update_one({"id": service_id}, {"$set": data.model_dump()})
    return Service(**updated)


@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, current_user: dict = Depends(get_current_user)):
    res = await db.services.delete_one({"id": service_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}


# ---------- Booking routes ----------
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

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


DEFAULT_SERVICES = [
    {"name_en": "Classic Relaxation Massage", "name_uk": "Класичний розслабляючий масаж",
     "name_ro": "Masaj clasic de relaxare",
     "description_en": "A gentle full-body massage to release tension and restore calm.",
     "description_uk": "М'який масаж усього тіла для зняття напруги та відновлення спокою.",
     "description_ro": "Un masaj blând al întregului corp pentru a elibera tensiunea și a reda calmul.",
     "duration": 60, "price": 55, "category": "relax",
     "image_url": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1"},
    {"name_en": "Deep Tissue Therapy", "name_uk": "Глибокотканинна терапія",
     "name_ro": "Terapie de țesut profund",
     "description_en": "Targeted pressure to relieve chronic muscle pain and stiffness.",
     "description_uk": "Цілеспрямований тиск для зняття хронічного болю та скутості м'язів.",
     "description_ro": "Presiune țintită pentru a ameliora durerile musculare cronice și rigiditatea.",
     "duration": 75, "price": 70, "category": "therapy",
     "image_url": "https://images.pexels.com/photos/6628601/pexels-photo-6628601.jpeg"},
    {"name_en": "Hot Stone Ritual", "name_uk": "Ритуал гарячого каміння",
     "name_ro": "Ritual cu pietre calde",
     "description_en": "Warm basalt stones melt away deep tension for total relaxation.",
     "description_uk": "Теплі базальтові камені знімають глибоку напругу для повного розслаблення.",
     "description_ro": "Pietre calde de bazalt topesc tensiunea profundă pentru o relaxare totală.",
     "duration": 90, "price": 90, "category": "relax",
     "image_url": "https://images.pexels.com/photos/6629530/pexels-photo-6629530.jpeg"},
    {"name_en": "Family Wellness Session", "name_uk": "Сімейний оздоровчий сеанс",
     "name_ro": "Ședință de wellness pentru familie",
     "description_en": "A nurturing session designed for restoring family wellbeing.",
     "description_uk": "Турботливий сеанс, створений для відновлення сімейного добробуту.",
     "description_ro": "O ședință îngrijitoare, concepută pentru a reface bunăstarea familiei.",
     "duration": 60, "price": 60, "category": "wellness",
     "image_url": "https://images.pexels.com/photos/6628612/pexels-photo-6628612.jpeg"},
]


@app.on_event("startup")
async def startup():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@familyhealth.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    await db.users.create_index("email", unique=True)
    existing = await db.users.find_one({"email": admin_email})
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

    if await db.services.count_documents({}) == 0:
        for s in DEFAULT_SERVICES:
            svc = Service(**s)
            await db.services.insert_one(svc.model_dump())
        logger.info("Seeded default services")

    # Backfill Romanian fields for previously seeded services
    for s in DEFAULT_SERVICES:
        await db.services.update_one(
            {"name_en": s["name_en"], "$or": [{"name_ro": {"$exists": False}}, {"name_ro": ""}]},
            {"$set": {"name_ro": s["name_ro"], "description_ro": s["description_ro"]}},
        )

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
