# 🛋️ Urgut Mebel Markazi - Zamonaviy va Buyurtma Mebellar Platformasi

To‘liq, ishlab chiqarishga tayyor (production-ready) zamonaviy mebel e-tijorat va individual o‘lchamdagi buyurtmalar platformasi.

---

## 🌟 Asosiy Imkoniyatlar & Xususiyatlar

1. **Mebel E-tijorati (E-commerce):**
   - Mahsulotlar katalogi, toifalash, narx va chegirma hisob-kitoblari.
   - Savat (Cart), buyurtmani rasmiylashtirish va mahsulot o‘chirilsa ham tarixiy ma'lumotlarni saqlab qoluvchi snapshot tizimi.
   - Mahsulot rasmlari galereyasi, o‘lchamlari, materiallari, rang tanlash, mavjudlik holati.

2. **Maxsus O‘lchamda Mebel Buyurtmasi (Custom Order):**
   - Alohida `/custom-order` sahifasi.
   - Xona turi, mebel turi, aniq o‘lchamlar (Uzunlik x Kenglik x Balandlik sm).
   - Yog‘och massivi (Eman, Yong‘oq, Qarag‘ay, MDF Akril) va qoplama (mat, glossy, moy-vosk) tanlovi.
   - Namuna fotosuratlar, texnik chizma/eskiz va xona rasmlarini yuklash.
   - Avtomatik noyob buyurtma raqami yaratish (`ORD-CUST-XXXX`).

3. **Menedjer Ish Jarayoni & Narx Kalkulyatori (/manager):**
   - Maxsus himoyalangan alohida menedjer paneli.
   - Buyurtma holatlari bosqichlari: `NEW` ➔ `REVIEWING` ➔ `CALCULATING` ➔ `PRICE_SENT` ➔ `CUSTOMER_APPROVED` ➔ `IN_PRODUCTION` ➔ `READY` ➔ `DELIVERING` ➔ `COMPLETED` ➔ `CANCELLED`.
   - **6 parametrli narx kalkulyatori:**
     - Material xarajati
     - Ish haqi (duradgorlik mehnati)
     - Qo‘shimcha fiting/mexanizmlar
     - Yetkazib berish va o‘rnatish xarajati
     - Chegirma
     - Yakuniy jami narx
   - Narx taklifini mijoz hisobiga yuborish va mijoz tomonidan qabul qilish (ACCEPT) yoki rad etish (REJECT) tizimi.
   - Ustaxona ichki maxfiy eslatmalari (internal notes).

4. **Yashirin Admin Paneli (/admin):**
   - Umumiy platforma tushumi va buyurtmalar statistikasi.
   - Mahsulotlar CRUD (yangi mebel qo‘shish, tahrirlash, o‘chirish, rasmlar, chegirmalar, qoldiq).
   - Kategoriyalar CRUD.
   - Ustalar boshqaruvi (portfolio, tajriba, xizmat narxlari).
   - Sharhlar va fikrlar moderatsiyasi (yashirish, o‘chirish, tasdiqlash).
   - **⭐️ Maxsus Talab: Web Loyiha Nomini O‘zgartirish (Dynamic Platform Title):**
     - Super Admin tizim sozlamalari bo‘limida istalgan vaqtda Web Loyiha Nomini o‘zgartira oladi.
     - Bu o‘zgarish avtomatik tarzda: sayt logotipi, yuqori Navbar, pastki Footer, sahifa sarlavhalari, brauzer tab nomi (`document.title`) va Admin panelida **darhol** aks etadi!

5. **Urgut Duradgorlari va Ustaxonalar Katalogi (/craftsmen):**
   - Har bir ustaning profili, duradgorlik tajribasi (yil), reytingi, telefoni, Telegram manzili.
   - Usta portfoliolar galereyasi va ko‘rsatadigan xizmatlari narxlari.
   - Mijozlar tomonidan ustaga to‘g‘ridan-to‘g‘ri shaxsiy buyurtma yuborish modali.

6. **4 Ta Foydalanuvchi Rol Tizimi (RBAC):**
   - **Guest (Mehmon):** Saytni, narxlarni, sharhlarni ko‘ra oladi; layk bosish, sharh yozish yoki buyurtma berish tugmasini bosganda kirish oynasi (Auth Modal) chiqadi.
   - **Customer (Mijoz):** Ro‘yxatdan o‘tish, savat, buyurtma berish, maxsus chizmali buyurtma yuborish, narx taklifini tasdiqlash/rad etish, layklar va sevimlilar.
   - **Manager (Menedjer):** O‘ziga biriktirilgan buyurtmalarni tekshirish, chizmalarni ko‘rish, narx hisoblab mijozga taklif yuborish, ishlab chiqarish holatini boshqarish.
   - **Admin (Super Admin):** To‘liq boshqaruv, mahsulotlar, kategoriyalar, sharhlar, tizim sozlamalari va sayt nomini boshqarish.

---

## 🛠 Texnologiyalar Steki

- **Frontend:** React 19, Vite, React Router 7, Modern Vanilla CSS Design Tokens, Lucide Icons.
- **Backend & Database:** Supabase, PostgreSQL, Row Level Security (RLS), Supabase Storage.
- **Offline / Local Resilient Engine:** Supabase `.env` sozlanmagan bo‘lsa ham to‘liq ishlash imkonini beruvchi mahalliy persistence va sinxronizatsiya qatlami.

---

## 🚀 Ishga Tushirish

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
```

### 2. Dasturni ishga tushirish (Development server):
```bash
npm run dev
```
Brauzerda oching: [http://localhost:5173](http://localhost:5173)

### 3. Production build qilish:
```bash
npm run build
```

---

## 🗄 Supabase Ma'lumotlar Bazasi va RLS ni Ulash

Loyiha ildizida to‘liq PostgreSQL migratsiyasi mavjud: [`supabase.sql`](file:///c:/Users/Soxibjon/Desktop/Urgut%20Mebel%20Markazi/supabase.sql).

1. [Supabase](https://supabase.com) platformasida yangi loyiha oching.
2. **SQL Editor** bo‘limiga kiring va `supabase.sql` fayli ichidagi barcha kodni joylashtirib, **RUN** tugmasini bosing.
3. `.env` fayliga o‘z Supabase URL va Anon Key ma'lumotlaringizni kiriting:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

---

## 👥 Tizimda Rollarni Sinash (Instant Role Switcher)

Ekraning pastki chap burchagida interaktiv **Rolni Almashtirish (Role Switcher)** panelchasi o‘rnatilgan. Siz birgina tugma orqali:
- **Mehmon (Guest)** rejimida cheklovlarni sinashingiz,
- **Mijoz (Customer)** rejimida buyurtma va narx taklifini qabul qilishni,
- **Menedjer (Manager)** rejimida `/manager` panelida narx kalkulyatorini ishlatishni,
- **Admin (Admin)** rejimida `/admin` panelida sayt nomini o‘zgartirib barcha joyda sinab ko‘rishingiz mumkin!
