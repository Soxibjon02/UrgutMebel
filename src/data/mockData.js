export const initialSettings = {
  id: 1,
  site_name: "Urgut Mebel Markazi",
  site_tagline: "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi",
  phone: "+998 90 456 78 90",
  email: "info@urgutmebel.uz",
  address: "Samarqand viloyati, Urgut tumani, Hunarmandlar shaharchasi, 24-bino",
  telegram: "@urgutmebel_uz",
  instagram: "@urgutmebel_official",
  currency: "so‘m",
  delivery_info: "O‘zbekiston bo‘ylab tezkor va xavfsiz yetkazib berish hamda professional o‘rnatish",
  hero_badge: "Yangi 2026 To‘plami",
  announcement: "Bahorgi aksiya: barcha yotoqxona to‘plamlariga 15% gacha chegirma!"
};

export const initialCategories = [
  {
    id: "cat-1",
    name: "Mehmonxona Mebellari",
    slug: "mehmonxona",
    description: "Hashamatli divanlar, vitrinalar, TV podstavkalar va kofe stollari",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    display_order: 1,
    is_active: true
  },
  {
    id: "cat-2",
    name: "Yotoqxona Mebellari",
    slug: "yotoqxona",
    description: "Orfopedik matrasli karavotlar, shkaflar, komodlar va tualet stollari",
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    display_order: 2,
    is_active: true
  },
  {
    id: "cat-3",
    name: "Oshxona Mebellari",
    slug: "oshxona",
    description: "Zamonaviy garniturlar, orollar, ovqatlanish stollari va qulay stullar",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    display_order: 3,
    is_active: true
  },
  {
    id: "cat-4",
    name: "Ofis va Ish Mebellari",
    slug: "ofis",
    description: "Ergonomik stollar, kreslolar, hujjatlar javonlari va muzokara stollari",
    image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    display_order: 4,
    is_active: true
  },
  {
    id: "cat-5",
    name: "Bolalar Xonasi",
    slug: "bolalar",
    description: "Xavfsiz ikki qavatli karavotlar, yozuv stollari va o‘yinchoq javonlari",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    display_order: 5,
    is_active: true
  },
  {
    id: "cat-6",
    name: "Yumshoq Mebellar",
    slug: "yumshoq-mebellar",
    description: "Burchak divanlar, qulay kreslolar va zamonaviy puflar",
    image_url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    display_order: 6,
    is_active: true
  }
];

export const initialProducts = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Royal Urgut Mehmonxona Divani",
    slug: "royal-urgut-mehmonxona-divani",
    price: 14500000,
    discount_price: 12800000,
    stock: 7,
    material: "Tabiiy eman karkas, Turkiya sifatli velur matosi",
    dimensions: "320 x 180 x 85 sm",
    colors: ["Krem-bej", "To‘q zumrad", "Shokolad"],
    description: "Mehmonxonangizga hashamat bag‘ishlovchi premium yumshoq divan. Mustahkam eman karkas va yuqori zichlikdagi ortopedik ko‘pik bilan ta'minlangan.",
    specifications: {
      "Karkas": "100% Quritilgan eman yog‘ochi",
      "Mato": "Anti-tirnalish (Antikogot) suv o‘tkazmas velur",
      "Kafolat": "5 yil rasmiy kafolat",
      "Mexanizm": "Panda transformatsiya tizimi"
    },
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: true,
    is_new: true,
    is_popular: true,
    tags: ["mehmonxona", "divan", "premium", "chegirma"],
    rating: 4.9,
    reviews_count: 28,
    likes_count: 84
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    name: "Samarqand Yotoqxona To‘plami (Krovat + Shkaf + Tumbalar)",
    slug: "samarqand-yotoqxona-toplami",
    price: 24000000,
    discount_price: 21500000,
    stock: 4,
    material: "Tabiiy yong‘oq shpon, MDF Akril fasadlar",
    dimensions: "Karavot: 200x180 sm, Shkaf: 240x220x60 sm",
    colors: ["Yong‘oq daraxti", "Oq marvarid", "Kulrang"],
    description: "Sokin uyqu va tartibli shkaf joylashuvi uchun mukammal to‘plam. Ortopedik panjara va keng saqlash qutilari mavjud.",
    specifications: {
      "Krovat o‘lchami": "180 x 200 sm",
      "Shkaf turi": "Kupe mexanizmi, Blum fitinglari",
      "Ishlab chiqaruvchi": "Urgut Mebel ustaxonasi",
      "Kafolat": "3 yil"
    },
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: true,
    is_new: true,
    is_popular: true,
    tags: ["yotoqxona", "karavot", "shkaf", "to'plam"],
    rating: 4.8,
    reviews_count: 19,
    likes_count: 62
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    name: "Modern Oshxona Garnituri 'Granit Elegance'",
    slug: "modern-oshxona-garnituri-granit-elegance",
    price: 18000000,
    discount_price: null,
    stock: 5,
    material: "MDF Akril yuqori qoplama, sun'iy tosh (Kvarts) stol usti",
    dimensions: "Uzunligi: 3.8 metr, Balandligi: 2.4 metr",
    colors: ["Grafit mat", "Oq marmar", "Zaytun"],
    description: "Namlikka va issiqqa chidamli, tozalanishi juda oson bo‘lgan zamonaviy oshxona to‘plami. Soft-close jim yopiluvchi mexanizmlar.",
    specifications: {
      "Stol usti": "Sun'iy kvarts tosh 30 mm",
      "Fasad": "AGT Akril panel",
      "Fitinglar": "Avstriya Blum tizimi",
      "Chiroqlar": "Sensorli LED tasmali yoritish"
    },
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: true,
    is_new: false,
    is_popular: true,
    tags: ["oshxona", "garnitur", "akril", "modern"],
    rating: 5.0,
    reviews_count: 34,
    likes_count: 112
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    name: "Executive Boshqaruvchi Ofis Stoli va Kreslosi",
    slug: "executive-boshqaruvchi-ofis-stoli",
    price: 9800000,
    discount_price: 8500000,
    stock: 12,
    material: "Tabiiy eman qoplamali qalin stol, metall karkas, tabiiy charm",
    dimensions: "Stol: 180x90x76 sm, Kreslo: baland orqa suyanchiq",
    colors: ["To‘q jigarrang", "Qora mat"],
    description: "Rahbarlar va ofis xodimlari uchun obro‘li, mustahkam va ergonomik ish stoli. Yashirin kabel kanallari bilan jihozlangan.",
    specifications: {
      "Stol qalinligi": "50 mm mustahkamlangan stol yuzasi",
      "Kreslo": "Ergonomik sinxron mexanizm",
      "Kabel kanallari": "Ichki yashirin metall kanal",
      "Kafolat": "2 yil"
    },
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1580481077195-c328ad45be48?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: false,
    is_new: true,
    is_popular: false,
    tags: ["ofis", "stol", "kreslo", "ish"],
    rating: 4.7,
    reviews_count: 15,
    likes_count: 40
  },
  {
    id: "prod-5",
    category_id: "cat-5",
    name: "Bolalar 'Eko-Sehr' Ikki Qavatli Karavoti",
    slug: "bolalar-eko-sehr-karavoti",
    price: 7600000,
    discount_price: 6900000,
    stock: 6,
    material: "Toza qarag‘ay yog‘ochi, ekologik xavfsiz suvli bo‘yoq",
    dimensions: "190 x 90 x 175 sm",
    colors: ["Oq / Tabiiy yog‘och", "Moviy pastel", "Pushti"],
    description: "Bolalar uchun mutlaqo xavfsiz, yumaloqlangan burchakli va qulay zinapoyali 2 qavatli karavot. Zinapoya tagida sig‘imli tortmalar bor.",
    specifications: {
      "Material": "Rossiya qayin / qarag‘ay massivi",
      "Yuk ko‘tarish": "Har bir qavat uchun 120 kg gacha",
      "Bo‘yoq": "Bolalar uchun EN-71 xalqaro sertifikatli",
      "Xavfsizlik": "Baland to‘siqlar bilan jihozlangan"
    },
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: false,
    is_new: false,
    is_popular: true,
    tags: ["bolalar", "karavot", "eko", "ikki qavatli"],
    rating: 4.9,
    reviews_count: 22,
    likes_count: 76
  },
  {
    id: "prod-6",
    category_id: "cat-6",
    name: "Skandinaviya Uslubidagi Relaks Kreslo",
    slug: "skandinaviya-uslubidagi-relaks-kreslo",
    price: 3200000,
    discount_price: 2750000,
    stock: 15,
    material: "Eman oyoqlar, yumshoq bukli mato",
    dimensions: "85 x 80 x 95 sm",
    colors: ["Sut rang", "Kulrang", "Xantal sariq"],
    description: "Kitob o‘qish va dam olish uchun qulay anatomik suyanchiqqa ega skandinavcha kreslo.",
    specifications: {
      "Oyoqlari": "Tabiiy eman yog‘ochi, laklangan",
      "Mato": "Bambukli va yumshoq bukli",
      "Kafolat": "2 yil"
    },
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: true,
    is_new: true,
    is_popular: false,
    tags: ["kreslo", "skandinaviya", "dam olish"],
    rating: 4.8,
    reviews_count: 11,
    likes_count: 53
  },
  {
    id: "prod-7",
    category_id: "cat-1",
    name: "Klassik Urgut Naqshli Kofe Stoli",
    slug: "klassik-urgut-naqshli-kofe-stoli",
    price: 2400000,
    discount_price: null,
    stock: 9,
    material: "Qo‘lda o‘yilgan yong‘oq daraxti, shisha ustki qatlam",
    dimensions: "110 x 60 x 48 sm",
    colors: ["Tabiiy yong‘oq", "Oltin jilo"],
    description: "Urgutning mohir yog‘och o‘ymakorlari tomonidan nozik milliy naqshlar bilan bezatilgan kofe stoli.",
    specifications: {
      "Uslub": "Milliy klassika",
      "Shisha": "Zarbaga chidamli 8 mm temperli shisha",
      "Hunarmand": "Usta Mahmud shogirdlari"
    },
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: false,
    is_new: false,
    is_popular: true,
    tags: ["kofe stoli", "urgut", "naqsh", "yog'och"],
    rating: 4.9,
    reviews_count: 17,
    likes_count: 45
  },
  {
    id: "prod-8",
    category_id: "cat-3",
    name: "Loft Usulidagi Ovqatlanish Stoli va 6 ta Stul",
    slug: "loft-ovqatlanish-stoli-va-6-stul",
    price: 8900000,
    discount_price: 7800000,
    stock: 8,
    material: "Qalin tabiiy qarag‘ay massivi, qora chang bilan bo‘yalgan metall karkas",
    dimensions: "Stol: 180x90x77 sm, Stullar: 45x45x85 sm",
    colors: ["Loft jigarrang / Qora metall"],
    description: "Oshxona yoki ovqatlanish xonasi uchun baquvvat va zamonaviy to‘plam. 10 yildan ortiq xizmat qilishiga kafolat beriladi.",
    specifications: {
      "Stol sirti": "40 mm yaxlit daraxt",
      "Metall profili": "60x40 mm elektrostatik bo‘yoq",
      "Sig‘imi": "6-8 kishi uchun qulay"
    },
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80"
    ],
    is_published: true,
    is_featured: true,
    is_new: true,
    is_popular: true,
    tags: ["loft", "ovqatlanish stoli", "stullar", "oshxona"],
    rating: 5.0,
    reviews_count: 31,
    likes_count: 98
  }
];

export const initialCraftsmen = [
  {
    id: "craft-1",
    name: "Usta Mahmudxon Rahimov",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    experience_years: 24,
    location: "Urgut tumani, Qoratepa",
    specializations: ["Klassik o‘ymakorlik", "Mehmonxona to‘plamlari", "Tabiiy yog‘och eshiklar"],
    rating: 5.0,
    reviews_count: 46,
    phone: "+998 91 555 12 34",
    telegram: "@usta_mahmud_urgut",
    bio: "24 yildan beri Urgutning qadimiy yog‘ochsozlik an'analari asosida buyurtma mebellar yasab kelmoqda. 1500 dan ziyod xonadon va idoralarni bezatgan mohir usta.",
    services: [
      { name: "Klassik o‘ymakor mehmonxona mebeli", price: "12,000,000 so‘mdan", desc: "Har bir naqsh qo‘lda o‘yiladi" },
      { name: "Yong‘oq va eman karavotlari", price: "9,000,000 so‘mdan", desc: "Umrlik mustahkamlik va tabiiy yog‘och" },
      { name: "O‘ymakor ustun va darvozalar", price: "Kelishuv asosida", desc: "Milliy me'morchilik san'ati" }
    ],
    portfolio: [
      { title: "Klassik Urgut vitrinasi", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
      { title: "Hashamatli mehmonxona stoli", image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80" },
      { title: "Eman yog‘ochli divan karkasi", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" }
    ],
    is_active: true
  },
  {
    id: "craft-2",
    name: "Akmaljon Olimov (Modern Ustaxonasi)",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    experience_years: 14,
    location: "Urgut shahri, Yangiobod",
    specializations: ["Zamonaviy oshxona garniturlari", "Shkaf-kupe", "Loft uslubi"],
    rating: 4.9,
    reviews_count: 38,
    phone: "+998 90 223 99 88",
    telegram: "@akmal_modern_mebel",
    bio: "Germaniya va Avstriya texnologiyalari (CNC, Blum) asosida yuqori aniqlikdagi nozik oshxona va shkaflarni tayyorlash bo‘yicha ixtisoslashgan.",
    services: [
      { name: "Modern oshxona garnituri", price: "2,500,000 so‘m / metr", desc: "Akril va tosh yuzali oshxonalar" },
      { name: "Shkaf-kupe va garderob", price: "1,800,000 so‘m / metr", desc: "Alyumin profillar va yumshoq yopilish" }
    ],
    portfolio: [
      { title: "Zaytun rangli zamonaviy oshxona", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
      { title: "Garderob xonasi to‘plami", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" }
    ],
    is_active: true
  },
  {
    id: "craft-3",
    name: "Usta Jamshid Beknazarov",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    experience_years: 18,
    location: "Urgut tumani, Mergancha",
    specializations: ["Yumshoq mebel yasash", "Chesterfield divanlar", "Mebel restavratsiyasi"],
    rating: 4.8,
    reviews_count: 29,
    phone: "+998 93 331 44 22",
    telegram: "@usta_jamshid_divan",
    bio: "Angliya va Italiya uslubidagi Chesterfield divanlari va yumshoq mebellar bo‘yicha tajribali usta. Har bir tikuv va tugmachani mehr bilan ishlaydi.",
    services: [
      { name: "Chesterfield tabiiy charm divan", price: "11,000,000 so‘mdan", desc: "Haqiqiy charm va ortopedik karkas" },
      { name: "Burchak divanlar buyurtmaga", price: "7,500,000 so‘mdan", desc: "Xonadon o‘lchamiga moslab chiqariladi" }
    ],
    portfolio: [
      { title: "Moviy baxmal burchak divan", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80" },
      { title: "Skandinav kreslosi", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" }
    ],
    is_active: true
  }
];

export const initialBanners = [
  {
    id: "ban-1",
    title: "Urgut Mebellari - Uyingizga Qulaylik Va Go‘zallik",
    subtitle: "Yog‘ochning tabiiy nafisi va zamonaviy texnologiyalar uyg‘unligi. Tayyor mebellar va maxsus buyurtmalar.",
    link: "/custom-order",
    image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    button_text: "O‘z O‘lchamingizda Buyurtma Bering",
    display_order: 1,
    is_active: true
  },
  {
    id: "ban-2",
    title: "Mehmonxona Uchun Eksklyuziv To‘plamlar",
    subtitle: "Royal to‘plami bilan mehmondorchilikda o‘zgacha muhit yarating. 15% chegirma bilan xarid qiling.",
    link: "/furniture?category=mehmonxona",
    image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    button_text: "Katalogni Ko‘rish",
    display_order: 2,
    is_active: true
  }
];

export const initialCustomOrders = [
  {
    id: "cust-ord-1",
    order_number: "ORD-CUST-8921",
    user_id: "user-cust-1",
    full_name: "Sherzod Aliyev",
    phone: "+998 90 987 65 43",
    email: "sherzod@gmail.com",
    address: "Toshkent shahar, Chilonzor tumani, 9-mavze",
    furniture_type: "Katta Oshxona Garnituri (Orolcha bilan)",
    room_type: "Oshxona",
    quantity: 1,
    length: 420,
    width: 280,
    height: 250,
    material: "Eman shpon + Oq Mat Akril fasad",
    color: "Oq va Tabiiy Yog‘oq aralash",
    finish: "Mat qoplama, tirnalishga chidamli",
    description: "L-shakldagi oshxona va o‘rtada 180x90 sm o‘lchamli orolcha kerak. Yashirin sovutgich va idish yuvish mashinasi uchun joy qoldirilsin.",
    special_requirements: "Barcha petlyalar Blum bo‘lsin, burchak qismida karusel tizimi o‘rnatilsin.",
    estimated_budget: 25000000,
    assigned_manager_id: "user-mgr-1",
    assigned_manager_name: "Bahodir Menedjer (Usta-muhandis)",
    status: "PRICE_SENT",
    internal_notes: "Mijoz bilan telefonlashildi. Xona chizmasi qabul qilindi. Hisob-kitob qilinib narx taklifi yuborildi.",
    created_at: "2026-10-08T10:30:00Z",
    files: [
      {
        id: "f-1",
        file_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        file_name: "oshxona_chizma_eskiz.jpg",
        file_category: "technical"
      }
    ],
    price_offer: {
      id: "po-1",
      material_cost: 14500000,
      labor_cost: 5800000,
      additional_cost: 1200000,
      delivery_cost: 1000000,
      discount: 1000000,
      total_price: 21500000,
      customer_status: "PENDING",
      notes: "Akril fasadlar, Blum fitinglari va yetkazib o‘rnatish xizmati ichida."
    }
  },
  {
    id: "cust-ord-2",
    order_number: "ORD-CUST-8922",
    user_id: "user-cust-2",
    full_name: "Dilnoza Karimova",
    phone: "+998 93 111 22 33",
    email: "dilnoza@mail.ru",
    address: "Samarqand shahar, Registon ko‘chasi, 15",
    furniture_type: "Bolalar ikki qavatli uycha karavoti",
    room_type: "Bolalar xonasi",
    quantity: 1,
    length: 200,
    width: 100,
    height: 220,
    material: "Tabiiy qarag‘ay daraxti",
    color: "Oq va Pushti pastel",
    finish: "Yarim yaltiroq ekologik lak",
    description: "Ikki qizim uchun uycha shaklidagi karavot. Pastki qavatda tortmalar va sirpanchiq (gorka) bo‘lishi lozim.",
    special_requirements: "Barcha burchaklar yumaloqlansin, 100% xavfsiz.",
    estimated_budget: 9000000,
    assigned_manager_id: "user-mgr-1",
    assigned_manager_name: "Bahodir Menedjer (Usta-muhandis)",
    status: "IN_PRODUCTION",
    internal_notes: "Mijoz narxni tasdiqladi. 50% bo‘nak qabul qilindi. Yog‘och korpusi yig‘ilmoqda.",
    created_at: "2026-10-06T14:15:00Z",
    files: [
      {
        id: "f-2",
        file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        file_name: "namuna_uycha.png",
        file_category: "reference"
      }
    ],
    price_offer: {
      id: "po-2",
      material_cost: 4800000,
      labor_cost: 2500000,
      additional_cost: 700000,
      delivery_cost: 300000,
      discount: 300000,
      total_price: 8000000,
      customer_status: "ACCEPTED",
      notes: "Bolalar uchun xavfsiz sertifikatlangan bo‘yoqlar qo‘llanadi."
    }
  }
];

export const initialOrders = [
  {
    id: "ord-std-101",
    order_number: "ORD-9901",
    user_id: "user-cust-1",
    full_name: "Sherzod Aliyev",
    phone: "+998 90 987 65 43",
    address: "Toshkent shahar, Chilonzor 9-mavze, 14-uy",
    delivery_method: "Kuryer orqali yetkazib berish (bepul)",
    payment_method: "Naqd to‘lov (qabul qilib olganda)",
    notes: "Iltimos, soat 18:00 dan keyin olib keling.",
    total_amount: 12800000,
    status: "processing",
    created_at: "2026-10-07T12:00:00Z",
    items: [
      {
        id: "item-1",
        product_id: "prod-1",
        product_name: "Royal Urgut Mehmonxona Divani",
        product_price: 12800000,
        product_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80",
        quantity: 1,
        total_price: 12800000
      }
    ]
  }
];

export const initialComments = [
  {
    id: "comm-1",
    product_id: "prod-1",
    user_id: "user-cust-1",
    user_name: "Sherzod Aliyev",
    rating: 5,
    content: "Divan juda sifatli keldi! Matosi mayin va yumshoq, Urgut ustalari baraka topishsin. Yetkazib o‘rnatib berish ham tez bo‘ldi.",
    is_approved: true,
    is_hidden: false,
    created_at: "2026-10-07T15:20:00Z",
    replies: [
      {
        id: "rep-1",
        user_name: "Urgut Mebel Ma'muriyati",
        content: "Xaridingiz uchun tashakkur, Sherzod aka! Uyingizga doimo fayz-u baraka tilaymiz.",
        created_at: "2026-10-07T16:00:00Z"
      }
    ]
  },
  {
    id: "comm-2",
    product_id: "prod-3",
    user_id: "user-cust-2",
    user_name: "Dilnoza Karimova",
    rating: 5,
    content: "Oshxona mebelimizni yasatdik. O‘lchamlari millimetrigacha to‘g‘ri chiqdi. Kvarts tosh usti juda hashamatli ko‘rinar ekan.",
    is_approved: true,
    is_hidden: false,
    created_at: "2026-10-05T09:12:00Z",
    replies: []
  }
];
