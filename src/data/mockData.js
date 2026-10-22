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
    id: "craft-soxib",
    name: "Soxib Gaybullayev",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    experience_years: 2,
    location: "Urgut tumani",
    specializations: ["Oshxona mebellari", "Ofis mebellari", "Yotoqxona to‘plamlari"],
    rating: 5.0,
    reviews_count: 1,
    phone: "+998 90 456 78 90",
    telegram: "@urgutmebel_uz",
    bio: "Professional mebel ustasi ! Ko‘plab korxona va ofislar mebellarini yasab topshirgan maser!",
    services: [
      { name: "Oshxona va xonadon mebellari", price: "Kelishuv asosida", desc: "Sifatli va zamonaviy materiallar" },
      { name: "Ofis va korxona mebellari", price: "Kelishuv asosida", desc: "Buyurtmaga asosan sifatli yig‘ish" }
    ],
    portfolio: [
      { title: "Mebel loyihasi 1", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" },
      { title: "Mebel loyihasi 2", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" }
    ],
    is_active: true
  }
];

export const initialBanners = [
  {
    id: "ban-1",
    title: "Yangi Mavsum: Barcha Mebellarga 20% gacha Chegirma!",
    subtitle: "Uyingiz va ofisingiz uchun Urgut ustalari yasagan eng sara to‘plamlar",
    link: "/furniture",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    button_text: "Katalogni Ko‘rish",
    is_active: true,
    display_order: 1
  },
  {
    id: "ban-2",
    title: "Maxsus Buyurtma Asosida Mebel Yasatish",
    subtitle: "O‘z o‘lchamingiz va xohlagan dizayningizni yuboring, bepul loyihalashtirib beramiz",
    link: "/custom-order",
    image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    button_text: "Buyurtma Berish",
    is_active: true,
    display_order: 2
  },
  {
    id: "ban-3",
    title: "Urgut Ustalari bilan To‘g‘ridan-To‘g‘ri Hamkorlik",
    subtitle: "Oradagi vositachilarsiz, arzon va kafolatlangan duradgorlik xizmatlari",
    link: "/craftsmen",
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    button_text: "Ustalar Ro‘yxati",
    is_active: true,
    display_order: 3
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

export const initialBlogPosts = [
  {
    id: "blog-1",
    title: "Kichik xonadonlarda mebeldan unumli foydalanishning 7 siri",
    slug: "kichik-xonadonlarda-mebeldan-unumli-foydalanish",
    excerpt: "Maydoni cheklangan xonalarni vizual jihatdan kengroq, havodorroq va funktsional qilish bo‘yicha interyer mutaxassislari tavsiyalari.",
    content: `
Kichik xonalarda qulaylik yaratish – bu murakkab san'at. Ammo to‘g‘ri tanlangan mebel va ranglar orqali hatto kichik maydonni ham shinam maskanga aylantirish mumkin.

### 1. Ko‘p funksiyali (transformatsiya) mebellardan foydalaning
Yig‘iladigan divan-karavotlar, ichida saqlash qutisi bo‘lgan puflar hamda ochiluvchi kofe stollari keraksiz bo‘shliqni tejaydi.

### 2. Oyoqli mebellarga afzallik bering
Pol yuzasi ko‘rinib turgan mebellar xonani vizual kengroq ko‘rsatadi. Yupqa yog‘och yoki metall oyoqli kreslo va divanlar yengil muhit hosil qiladi.

### 3. Ochiq va neytral ranglar palitrasi
Och yog‘och ohanglari, krem, sut ranglari va iliq kulrang xonaga ko‘proq tabiiy yorug‘lik baxsh etadi.

### 4. Vertikal saqlash joylaridan foydalaning
Shiftdan polgacha bo‘lgan shkaflar nafaqat ko‘p buyumlarni sig‘diradi, balki xona balandligini ham balandroq ko‘rsatadi.

Urgut Mebel ustalari aynan sizning xonangiz o‘lchamlariga moslab istalgan nostandart ixcham mebellarni yasab berishadi.
    `,
    cover_image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    category: "Dizayn",
    author_name: "Nilufar Rahimova",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    read_time: "5 daqiqa",
    is_published: true,
    created_at: "2026-10-12T10:00:00Z"
  },
  {
    id: "blog-2",
    title: "Zamonaviy ovqatlanish stoli va stullarini qanday tanlash kerak?",
    slug: "zamonaviy-ovqatlanish-stoli-va-stullari-tanlash",
    excerpt: "Tabiiy yog‘och, metall va tosh yuzalarning qulaylik hamda chidamlilik jihatdan solishtirmasi.",
    content: `
Ovqatlanish stoli oilaning eng iliq suhbatlari o‘tadigan markaziy mebel hisoblanadi. Uni tanlashda quyidagi omillarni hisobga oling:

### Shakli va o‘lchami
- To‘rtburchak stol – 6-10 kishilik katta oilalar va uzunchoq xonalar uchun ideal.
- Dumaloq stol – samimiy muhit yaratadi, o‘tkir burchaklari yo‘qligi sababli yosh bolalar uchun xavfsiz.

### Tabiiy eman yoki yong‘oq
Tabiiy yog‘och o‘zining takrorlanmas teksturasi va o‘nlab yillar xizmat qilishi bilan ajralib turadi. Urgut ustalari yog‘ochga suv o‘tkazmaydigan ekologik moy va laklar bilan ishlov berishadi.
    `,
    cover_image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    category: "Maslahatlar",
    author_name: "Bobur Usmonov (Bosh Usta)",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    read_time: "4 daqiqa",
    is_published: true,
    created_at: "2026-10-10T14:30:00Z"
  },
  {
    id: "blog-3",
    title: "Urgut duradgorlik san'ati: Asrlar an'anasi va zamonaviy uslub",
    slug: "urgut-duradgorlik-sanati-anana-va-uslub",
    excerpt: "Urgutning mashhur yog‘ochsozlik maktabi qanday qilib zamonaviy Yevropa mebel dizaynlari bilan uyg‘unlashmoqda?",
    content: `
Samarqand viloyatining Urgut tumani qadimdan mohir yog‘och o‘ymakorlari va usta duradgorlari bilan mashhur. 

Bugungi kunda Urgut mebel ustalari asriy sirlarni saqlagan holda zamonaviy CNC uskunalari, Turkiya va Germaniya furnituralari hamda Italiya bo‘yoqlaridan foydalanib xalqaro andozalardagi mebellarni ishlab chiqarmoqdalar.

Har bir buyurtma mebel – bu takrorlanmas san'at asari bo‘lib, uyingizga o‘zgacha harorat bag‘ishlaydi.
    `,
    cover_image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80",
    category: "Hunarmandchilik",
    author_name: "Azizbek Mansurov",
    author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    read_time: "6 daqiqa",
    is_published: true,
    created_at: "2026-10-06T08:15:00Z"
  }
];

export const initialFaqItems = [
  {
    id: "faq-1",
    category: "Umumiy savollar",
    question: "Urgut Mebel Markazi mahsulotlari qayerda ishlab chiqariladi?",
    answer: "Barcha mebellarimiz Samarqand viloyati, Urgut tumanidagi maxsus jihozlangan zamonaviy ustaxona va fabrikalarda mahalliy mohir duradgor ustalar tomonidan tayyorlanadi.",
    display_order: 1,
    is_active: true
  },
  {
    id: "faq-2",
    category: "Umumiy savollar",
    question: "Mebellar tayyorlashda qanday materiallardan foydalaniladi?",
    answer: "Tabiiy quritilgan eman, yong‘oq va qarag‘ay yog‘ochlari, yuqori sifatli Rossiya va Turkiya MDF, LDSP plitalari, Blum va Hettich furnituralari hamda suv o‘tkazmas velur va eko-charm matolari ishlatiladi.",
    display_order: 2,
    is_active: true
  },
  {
    id: "faq-3",
    category: "Buyurtma va to'lov",
    question: "Maxsus o'lchamda buyurtma berish qanday amalga oshiriladi?",
    answer: "Siz 'Maxsus Buyurtma' bo‘limidan o‘zingiz xohlagan o‘lcham, rang va rasmlarni yuklashingiz mumkin. Menejerlarimiz 1 soat ichida bog‘lanib narx taklifi va loyiha eskizini taqdim etadilar. Shuningdek mutaxassisimiz uyingizga borib bepul o‘lchab berishi ham mumkin.",
    display_order: 3,
    is_active: true
  },
  {
    id: "faq-4",
    category: "Buyurtma va to'lov",
    question: "To'lov usullari qanday? Bo'lib to'lash imkoni bormi?",
    answer: "To‘lovlarni naqd pul, Click, Payme yoki bank kartasi orqali amalga oshirishingiz mumkin. Shuningdek, qulay muddatli to‘lov (nasiya savdo) shartlari ham mavjud.",
    display_order: 4,
    is_active: true
  },
  {
    id: "faq-5",
    category: "Yetkazib berish",
    question: "Yetkazib berish va o'rnatish xizmati qancha vaqt oladi?",
    answer: "Katalogdagi tayyor mahsulotlar 24-48 soat ichida butun O‘zbekiston bo‘ylab yetkaziladi. Maxsus buyurtmalar murakkabligiga qarab 5 kundan 14 kungacha muddatda tayyorlanadi va professional ustalarimiz tomonidan o‘rnatib beriladi.",
    display_order: 5,
    is_active: true
  },
  {
    id: "faq-6",
    category: "Kafolat va qaytarish",
    question: "Mebellarga qancha muddat kafolat beriladi?",
    answer: "Har bir mahsulotimizga 3 yildan 5 yilgacha rasmiy sifat kafolati taqdim etiladi. Kafolat davrida nosozlik yuzaga kelsa, bepul ta'mirlab yoki almashtirib beriladi.",
    display_order: 6,
    is_active: true
  }
];

export const initialCraftsmanRequests = [
  {
    id: "req-1",
    request_number: "UR-REQ-1001",
    craftsman_id: "usta-1",
    craftsman_name: "Bobur Usmonov",
    customer_name: "Akmal Zokirov",
    customer_phone: "+998 91 234 56 78",
    customer_telegram: "@akmal_z",
    furniture_type: "Klassik Mehmonxona Stoli va 8 ta stul",
    description: "Tabiiy eman yog‘ochidan qo‘lda o‘yilgan naqshli, och yong‘oq rangida sifatli ovqatlanish stoli kerak.",
    preferred_date: "2026-11-15",
    estimated_budget: "10 000 000 - 15 000 000 so‘m",
    status: "NEW",
    craftsman_notes: "Mijoz bilan bog‘lanib aniq o‘lchamlar kelishilmoqda",
    created_at: "2026-10-15T11:00:00Z"
  },
  {
    id: "req-2",
    request_number: "UR-REQ-1002",
    craftsman_id: "usta-2",
    craftsman_name: "Rustam Qodirov",
    customer_name: "Zarina Alimova",
    customer_phone: "+998 97 765 43 21",
    customer_telegram: "@zarina_m",
    furniture_type: "Bolalar ikki qavatli karavoti",
    description: "Zinapoyasi saqlash javonli, xavfsiz himoya to‘sig‘i bo‘lgan zamonaviy oq rangli karavot.",
    preferred_date: "2026-11-01",
    estimated_budget: "7 000 000 so‘m",
    status: "IN_PROGRESS",
    craftsman_notes: "Karkas yig‘ish jarayonida",
    created_at: "2026-10-14T09:30:00Z"
  }
];

export const initialContactMessages = [
  {
    id: "msg-1",
    full_name: "Javohir Toshpulatov",
    phone: "+998 93 111 22 33",
    email: "javohir@example.com",
    subject: "Ulgurji narxlar va yetkazish",
    message: "Toshkent shahridagi yangi ofis binosi uchun 20 ta ishchi stoli va kreslolarga buyurtma bermoqchimiz. Ulgurji chegirmalar mavjudmi?",
    status: "NEW",
    reply_notes: null,
    created_at: "2026-10-17T14:20:00Z"
  },
  {
    id: "msg-2",
    full_name: "Kamola Saidova",
    phone: "+998 90 987 65 43",
    email: "kamola@example.com",
    subject: "Katalogdagi divan rangi",
    message: "Royal divanini kulrang emas, to‘q ko‘k (navy blue) matoda buyurtma qilsak bo‘ladimi? Narxi o‘zgaradimi?",
    status: "REPLIED",
    reply_notes: "Telefon orqali tushuntirildi, mato namunalari Telegramga tashlandi.",
    created_at: "2026-10-16T16:45:00Z"
  }
];

export const initialNewsletterSubscribers = [
  {
    id: "sub-1",
    email: "anvar.karimov@gmail.com",
    full_name: "Anvar Karimov",
    source: "figma_join_us",
    discount_code: "URGUT10",
    is_active: true,
    created_at: "2026-10-15T08:00:00Z"
  },
  {
    id: "sub-2",
    email: "shaxnoza.dizayn@mail.ru",
    full_name: "Shaxnoza",
    source: "figma_join_us",
    discount_code: "URGUT10",
    is_active: true,
    created_at: "2026-10-16T11:20:00Z"
  }
];
