import React, { createContext, useContext, useState, useCallback } from "react";

export const translations = {
  en: {
    brand: "Family Health",
    nav_home: "Home",
    nav_services: "Services",
    nav_about: "About",
    nav_contact: "Contact",
    nav_book: "Book Now",
    call_us: "Call Us",

    hero_eyebrow: "Massage & Wellness Studio",
    hero_title: "Healing hands for the whole family",
    hero_sub:
      "A calm, warm sanctuary where every session is crafted to restore body and mind. Relax, rejuvenate, and feel cared for.",
    hero_cta: "Book a Session",
    hero_secondary: "Explore Services",

    marquee: "Relax • Rejuvenate • Restore • Breathe • Heal • Family Care",

    services_title: "Our Signature Treatments",
    services_sub:
      "Thoughtfully designed massage therapies for relaxation, recovery, and lasting wellbeing.",
    services_view_all: "View all services",
    min: "min",
    book_this: "Book this",

    why_title: "Why families choose us",
    why_1_title: "Certified Therapists",
    why_1_text:
      "Experienced, licensed practitioners dedicated to your comfort and care.",
    why_2_title: "Calming Atmosphere",
    why_2_text:
      "A warm, serene space designed to melt away the stress of everyday life.",
    why_3_title: "Personalised Care",
    why_3_text:
      "Every session is tailored to your body's unique needs and goals.",

    about_title: "A space made for rest",
    about_p1:
      "Family Health Design Studio was founded in 2019 on a simple belief: everyone deserves a moment of true peace. We combine time-tested massage techniques with a warm, welcoming atmosphere, where the space itself works for your recovery.",
    about_p2:
      "From classic relaxation to deep tissue therapy, our certified therapists guide you toward balance, relief, and renewed energy — for you and your whole family.",
    about_stat_1: "Years of care",
    about_stat_2: "Happy clients",
    about_stat_3: "Therapies",

    booking_title: "Book your session",
    booking_sub:
      "Choose a treatment, pick a date and time, and leave the rest to us.",
    form_name: "Full name",
    form_phone: "Phone number",
    form_email: "Email (optional)",
    form_service: "Select a treatment",
    form_date: "Preferred date",
    form_time: "Preferred time",
    form_notes: "Notes (optional)",
    form_submit: "Confirm Booking",
    form_success:
      "Thank you! Your booking request has been received. We'll call to confirm shortly.",
    form_error: "Something went wrong. Please try again or call us.",
    pick_date: "Pick a date",

    contact_title: "Visit us",
    contact_sub:
      "We'd love to welcome you. Reach out or simply give us a call.",
    contact_phone: "Phone",
    contact_address: "Address",
    contact_hours: "Opening hours",
    contact_address_val: "221 Pantelimon Avenue, Bucharest, Romania",
    contact_hours_val: "Mon–Sat: 9:00 — 20:00",
    contact_consult: "Message us on Telegram",
    contact_instagram: "Message us on Instagram",
    contact_whatsapp: "Message us on WhatsApp",
    contact_facebook: "Message us on Facebook",
    contact_social_title: "Chat with us on messengers:",

    price_title_back: "Therapeutic back massage",
    price_title_general: "Therapeutic general massage",
    price_title_lymph: "Lymphatic drainage massage",
    price_title_anti: "Anti-cellulite massage (hardware, manual, combo)",
    price_title_presso: "Pressotherapy",
    price_title_myo: "Myostimulation",
    price_title_rf: "RF lifting (body, face)",
    price_title_vacuum: "Back massage + vacuum therapy",
    price_title_facial: "Facial massage + alginate mask",
    price_title_baby: "Baby massage",
    price_title_taping: "Kinesiotaping",
    price_title_face_back: "Face massage + back massage",
    price_title_gen_face: "General massage + face massage",
    price_title_presso_face: "Pressotherapy + face massage",
    services_certified_note:
      "All procedures are performed by certified specialists",
    services_tab_manual: "Manual Massages",
    services_tab_hardware: "Hardware Treatments",
    services_tab_combo: "Combined Packages",
    services_book_btn: "Book an Appointment",
    services_unavailable: "Services are temporarily unavailable.",

    services_min_short: "min",
    currency: "RON",
    services_cert_block_title: "Certificates",
    services_cert_subtitle: "A gift everyone will truly appreciate!",
    services_cert_block_desc:
      "Want to congratulate someone on a special occasion or simply make a loved one, mom, friend, or colleague happy? Then give a gift that is sure to please — a gift certificate from Family Health Design Studio.",
    services_cert_btn: "Order Certificate",
    services_form_title: "Request a Certificate",
    form_placeholder_name: "Your name",
    form_placeholder_phone: "Your phone number",
    form_placeholder_msg: "Your message or wishes",
    form_submit_success:
      "Thank you! Your certificate order has been successfully sent.",
    form_submit_error:
      "Sending failed. Please try again or contact us directly.",
    form_btn_send: "Send Request",
    form_btn_sending: "Sending...",

    footer_tagline: "Healing hands for the whole family.",
    footer_rights: "All rights reserved.",
    footer_quick: "Quick Links",
    footer_contact: "Contact",
    footer_follow_us: "Follow us",

    admin_login_title: "Admin Login",
    admin_email: "Email",
    admin_password: "Password",
    admin_signin: "Sign In",
    admin_dashboard: "Dashboard",
    admin_bookings: "Bookings",
    admin_services: "Services",
    admin_logout: "Log out",
    admin_total: "Total bookings",
    admin_pending: "Pending",
    admin_confirmed: "Confirmed",
    admin_services_count: "Services",
    admin_name: "Name",
    admin_phone: "Phone",
    admin_service: "Service",
    admin_date: "Date",
    admin_status: "Status",
    admin_actions: "Actions",
    admin_edit_service: "Edit Service",
    admin_save: "Save",
    admin_add_service: "Add Service",
    name_en: "Name (EN)",
    name_uk: "Name (UK)",
    name_ro: "Name (RO)",
    price: "Price (RON)",
    duration_min: "Duration (min)",
    status_pending: "Pending",
    status_confirmed: "Confirmed",
    status_cancelled: "Cancelled",
  },
  uk: {
    brand: "Family Health",
    nav_home: "Головна",
    nav_services: "Послуги",
    nav_about: "Про нас",
    nav_contact: "Контакти",
    nav_book: "Записатися",
    call_us: "Зателефонувати",

    hero_eyebrow: "Студія масажу та оздоровлення",
    hero_title: "Зцілюючі руки для всей родини",
    hero_sub:
      "Тепле та спокійне місце, де кожен сеанс створено для відновлення тіла й душі. Розслабтеся, відновіться та відчуйте турботу.",
    hero_cta: "Записатися на сеанс",
    hero_secondary: "Переглянути послуги",

    marquee:
      "Спокій • Відновлення • Оновлення • Дихання • Зцілення • Турбота про родину",

    services_title: "Наші фірмові процедури",
    services_sub:
      "Ретельно розроблені масажні терапії для розслаблення, відновлення та тривалого добробуту.",
    services_view_all: "Усі послуги",
    min: "хв",
    book_this: "Записатися",

    why_title: "Чому родини обирають нас",
    why_1_title: "Сертифіковані терапевти",
    why_1_text:
      "Досвідчені ліцензовані спеціалісти, віддані вашому комфорту та турботі.",
    why_2_title: "Заспокійлива атмосфера",
    why_2_text:
      "Тепле, безтурботне місце, створене, щоб розчинити стрес буденності.",
    why_3_title: "Індивідуальний підхід",
    why_3_text: "Кожен сеанс підлаштований під унікальні потреби вашого тіла.",

    about_title: "Простір, створений для відпочинку",
    about_p1:
      "Студія дизайну здоров’я “Family Health” була заснована у 2019 році на простій вірі: кожен заслуговує на мить справжнього спокою. Ми поєднуємо перевірені часом техніки масажу з теплою, гостинною атмосферою, де простір працює на ваше відновлення.",
    about_p2:
      "Від класичного розслаблення до глибокотканинної терапії — наші сертифіковані терапевти ведуть вас до балансу, полегшення та оновленої енергії для вас і всієї родини.",
    about_stat_1: "Років турботи",
    about_stat_2: "Задоволених клієнтів",
    about_stat_3: "Терапій",

    booking_title: "Запис на сеанс",
    booking_sub: "Оберіть процедуру, дату й час, а решту залиште нам.",
    form_name: "Повне ім'я",
    form_phone: "Номер телефону",
    form_email: "Email (необов'язково)",
    form_service: "Оберіть процедуру",
    form_date: "Бажана дата",
    form_time: "Бажаний час",
    form_notes: "Примітки (необов'язково)",
    form_submit: "Підтвердити запис",
    form_success:
      "Дякуємо! Ваш запис отримано. Ми незабаром зателефонуємо для підтвердження.",
    form_error: "Щось пішло не так. Спробуйте ще раз або зателефонуйте нам.",
    pick_date: "Оберіть дату",

    contact_title: "Завітайте до нас",
    contact_sub:
      "Ми будемо раді вас бачити. Напишіть нам або просто зателефонуйте.",
    contact_phone: "Телефон",
    contact_address: "Адреса",
    contact_hours: "Години роботи",
    contact_address_val: "Шосе Пантелимон 221, Бухарест, Румунія",
    contact_hours_val: "Пн–Сб: 9:00 — 20:00",
    contact_consult: "Написати в Telegram",
    contact_instagram: "Написати в Instagram",
    contact_whatsapp: "Написати в WhatsApp",
    contact_facebook: "Написати в Facebook",
    contact_social_title: "Зв'язатися з нами в месенджерах:",

    price_title_back: "Терапевтичний масаж спини",
    price_title_general: "Терапевтичний загальний масаж",
    price_title_lymph: "Лімфодренажний масаж",
    price_title_anti: "Антицелюлітний масаж (апаратний, ручний, комбо)",
    price_title_presso: "Пресотерапія",
    price_title_myo: "Міостимуляція",
    price_title_rf: "RF-ліфтинг (тіло, обличчя)",
    price_title_vacuum: "Масаж спини + вакуумна терапія",
    price_title_facial: "Масаж обличчя + альгінатна маска",
    price_title_baby: "Дитячий масаж",
    price_title_taping: "Кінезіотейпування",
    price_title_face_back: "Масаж обличчя + масаж спини",
    price_title_gen_face: "Загальний масаж + масаж обличчя",
    price_title_presso_face: "Пресотерапія + масаж обличчя",
    services_certified_note:
      "Всі процедури проводяться сертифікованими спеціалістами",

    services_tab_manual: "Ручні масажі",
    services_tab_hardware: "Апаратні",
    services_tab_combo: "Комплекси",
    services_book_btn: "Записатися на процедуру",
    services_unavailable: "Послуги тимчасово недоступні.",

    // Нові ключі для української версії
    services_min_short: "хв",
    currency: "лей",
    services_cert_block_title: "Сертифікати",
    services_cert_subtitle: "Подарунок, який гідно оцінить кожен!",
    services_cert_block_desc:
      "Бажаєте привітати з важливою датою і просто зробити приємне коханій людині, мамі, подрузі або колезі? Тоді піднесіть подарунок, який точно сподобається – подарунковий сертифікат от студии дизайна здоровья Family Health.",
    services_cert_btn: "Подарувати / Замовити",
    services_form_title: "Замовити сертифікат",
    form_placeholder_name: "Ваше ім'я",
    form_placeholder_phone: "Ваш номер телефону",
    form_placeholder_msg: "Ваше повідомлення",
    form_submit_success:
      "Дякуємо! Ваше замовлення сертифікату успішно надіслано.",
    form_submit_error:
      "Помилка надсилання. Спробуйте ще раз або зателефонуйте нам.",
    form_btn_send: "Надіслати",
    form_btn_sending: "Надсилання...",

    footer_tagline: "Зцілюючі руки для всієї родини.",
    footer_rights: "Усі права захищені.",
    footer_quick: "Швидкі посилання",
    footer_contact: "Контакти",
    footer_follow_us: "Підписуйтесь на нас",

    admin_login_title: "Вхід для адміністратора",
    admin_email: "Email",
    admin_password: "Пароль",
    admin_signin: "Увійти",
    admin_dashboard: "Панель",
    admin_bookings: "Записи",
    admin_services: "Послуги",
    admin_logout: "Вийти",
    admin_total: "Усього записів",
    admin_pending: "Очікують",
    admin_confirmed: "Підтверджені",
    admin_services_count: "Послуги",
    admin_name: "Ім'я",
    admin_phone: "Телефон",
    admin_service: "Послуга",
    admin_date: "Дата",
    admin_status: "Статус",
    admin_actions: "Дії",
    admin_edit_service: "Редагування послуги",
    admin_save: "Зберегти",
    admin_add_service: "Додати послугу",
    name_en: "Назва (EN)",
    name_uk: "Назва (UK)",
    name_ro: "Назва (RO)",
    price: "Ціна (лей)",
    duration_min: "Тривалість (хв)",
    status_pending: "В очікуванні",
    status_confirmed: "Підтверджено",
    status_cancelled: "Скасовано",
  },

  ro: {
    brand: "Family Health",
    nav_home: "Acasă",
    nav_services: "Servicii",
    nav_about: "Despre noi",
    nav_contact: "Contact",
    nav_book: "Programează-te",
    call_us: "Sună-ne",

    hero_eyebrow: "Studio de masaj și wellness",
    hero_title: "Mâini vindecătoare pentru toată familia",
    hero_sub:
      "Un refugiu cald și liniștit, unde fiecare ședință este concepută pentru a reface corpul și mintea. Relaxează-te, revigorează-te și simte-te îngrijit.",
    hero_cta: "Programează o ședință",
    hero_secondary: "Explorează serviciile",

    marquee:
      "Relaxare • Revigorare • Refacere • Respiră • Vindecă • Grija familiei",

    services_title: "Tratamentele noastre semnătură",
    services_sub:
      "Terapii de masaj gândite cu grijă pentru relaxare, recuperare și bunăstare de durată.",
    services_view_all: "Vezi toate serviciile",
    min: "min",
    book_this: "Programează",

    why_title: "De ce ne aleg familiile",
    why_1_title: "Terapeuți certificați",
    why_1_text:
      "Practicieni experimentați și licențiați, dedicați confortului și îngrijirii tale.",
    why_2_title: "Atmosferă liniștitoare",
    why_2_text:
      "Un spațiu cald și senin, creat pentru a topi stresul vieții cotidiene.",
    why_3_title: "Îngrijire personalizată",
    why_3_text:
      "Fiecare ședință este adaptată nevoilor unice ale corpului tău.",

    about_title: "Un spațiu creat pentru odihnă",
    about_p1:
      "Studioul de design al sănătății „Family Health” a fost fondat în 2019 pe baza unei credințe simple: fiecare merită o clipă de adevărată liniște. Combinăm tehnici de masaj verificate de timp cu o atmosferă caldă și primitoare, unde spațiul lucrează pentru recuperarea dumneavoastră.",
    about_p2:
      "De la relaxarea clasică la terapia țesuturilor profunde, terapeuții noștri certificați te ghidează spre echilibru, alinare și energie reînnoită — pentru tine și întreaga familie.",
    about_stat_1: "Ani de îngrijire",
    about_stat_2: "Clienți mulțumiți",
    about_stat_3: "Terapii",

    booking_title: "Rezervă ședința ta",
    booking_sub:
      "Alege un tratament, o dată și o oră, iar restul lasă-l în seama noastră.",
    form_name: "Nume complet",
    form_phone: "Număr de telefon",
    form_email: "Email (opțional)",
    form_service: "Selectează un tratament",
    form_date: "Data preferată",
    form_time: "Ora preferată",
    form_notes: "Observații (opțional)",
    form_submit: "Confirmă programarea",
    form_success:
      "Mulțumim! Cererea ta de programare a fost primită. Te vom suna în curând pentru confirmare.",
    form_error: "Ceva nu a mers bine. Încearcă din nou sau sună-ne.",
    pick_date: "Alege o dată",

    contact_title: "Vizitează-ne",
    contact_sub:
      "Ne-ar face plăcere să te primim. Contactează-ne sau pur și simplu sună-ne.",
    contact_phone: "Telefon",
    contact_address: "Adresă",
    contact_hours: "Program",
    contact_address_val: "Șos. Pantelimon 221, București, Romania",
    contact_hours_val: "Lun–Sâm: 9:00 — 20:00",
    contact_consult: "Trimite un mesaj pe Telegram",
    contact_instagram: "Trimite mesaj pe Instagram",
    contact_whatsapp: "Trimite mesaj pe WhatsApp",
    contact_facebook: "Trimite mesaj pe Facebook",
    contact_social_title: "Contactați-ne pe mesageri:",

    price_title_back: "Masaj terapeutic al spatelui",
    price_title_general: "Masaj terapeutic general",
    price_title_lymph: "Masaj de drenaj limfatic",
    price_title_anti: "Masaj anticelulitic (aparat, manual, combo)",
    price_title_presso: "Presoterapie",
    price_title_myo: "Miostimulare",
    price_title_rf: "Lifting RF (corp, față)",
    price_title_vacuum: "Masaj de spate + terapie cu vid",
    price_title_facial: "Masaj facial + mască alginată",
    price_title_baby: "Masaj pentru copii",
    price_title_taping: "Kinesiotaping",
    price_title_face_back: "Masaj facial + masaj de spate",
    price_title_gen_face: "Masaj general + masaj facial",
    price_title_presso_face: "Presoterapie + masaj facial",
    services_certified_note:
      "Toate procedurile sunt efectuate de specialiști certificați",

    services_tab_manual: "Masaje Manuale",
    services_tab_hardware: "Tratamente cu Aparatură",
    services_tab_combo: "Pachete Combinate",
    services_book_btn: "Programează o procedură",
    services_unavailable: "Serviciile sunt temporar indisponibile.",

    services_min_short: "min",
    currency: "RON",
    services_cert_block_title: "Certificate",
    services_cert_subtitle: "Un cadou pe care îl va aprecia oricine!",
    services_cert_block_desc:
      "Doriți să felicitați pe cineva cu o ocazie importantă sau pur și simplu să faceți o surpriză plăcută unei persoane dragi, mamei, prietenei sau colegei? Atunci oferiți un cadou care cu siguranță va fi pe plac — un certificat cadou de la studioul de design al sănătății Family Health.",
    services_cert_btn: "Comandă un Certificat",
    services_form_title: "Solicită un Certificat",
    form_placeholder_name: "Numele tău",
    form_placeholder_phone: "Numărul tău de telefon",
    form_placeholder_msg: "Mesajul tău sau detalii",
    form_submit_success:
      "Mulțumim! Cererea pentru certificatul cadou a fost trimisă cu succes.",
    form_submit_error:
      "Eroare la trimitere. Încearcă din nou sau contactează-ne direct.",
    form_btn_send: "Trimite",
    form_btn_sending: "Se trimite...",

    footer_tagline: "Mâini vindecătoare pentru toată familia.",
    footer_rights: "Toate drepturile rezervate.",
    footer_quick: "Linkuri rapide",
    footer_contact: "Contact",
    footer_follow_us: "Urmăriți-ne",

    admin_login_title: "Autentificare administrator",
    admin_email: "Email",
    admin_password: "Parolă",
    admin_signin: "Conectare",
    admin_dashboard: "Panou",
    admin_bookings: "Programări",
    admin_services: "Servicii",
    admin_logout: "Deconectare",
    admin_total: "Total programări",
    admin_pending: "În așteptare",
    admin_confirmed: "Confirmate",
    admin_services_count: "Servicii",
    admin_name: "Nume",
    admin_phone: "Telefon",
    admin_service: "Serviciu",
    admin_date: "Data",
    admin_status: "Statut",
    admin_actions: "Acțiuni",
    admin_edit_service: "Editare Serviciu",
    admin_save: "Salvează",
    admin_add_service: "Adaugă Serviciu",
    name_en: "Nume (EN)",
    name_uk: "Nume (UK)",
    name_ro: "Nume (RO)",
    price: "Preț (RON)",
    duration_min: "Durată (min)",
    status_pending: "În așteptare",
    status_confirmed: "Confirmat",
    status_cancelled: "Anulat",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(
    () => localStorage.getItem("fh_lang") || "en",
  );

  const toggle = useCallback(() => {
    setLang((prev) => {
      const order = ["en", "uk", "ro"];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      localStorage.setItem("fh_lang", next);
      return next;
    });
  }, []);

  const t = useCallback((key) => translations[lang][key] ?? key, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);

export const LANG_LABELS = { en: "EN", uk: "UA", ro: "RO" };

export const serviceName = (s, lang) =>
  (lang === "uk" ? s.name_uk : lang === "ro" ? s.name_ro : s.name_en) ||
  s.name_en;

export const serviceDesc = (s, lang) =>
  (lang === "uk"
    ? s.description_uk
    : lang === "ro"
      ? s.description_ro
      : s.description_en) || s.description_en;
