import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { CraftsmanCard } from '../components/CraftsmanCard';
import { CraftsmanRequestModal } from '../components/CraftsmanRequestModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  PenTool,
  CheckCircle,
  Star,
  Quote,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const Home = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [craftsmen, setCraftsmen] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodList, catList, craftList, banList] = await Promise.all([
          dataService.getProducts(),
          dataService.getCategories(),
          dataService.getCraftsmen(),
          dataService.getBanners()
        ]);
        setProducts(prodList || []);
        setCategories(catList || []);
        setCraftsmen(craftList || []);
        setBanners(banList || []);
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Filter product groups
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
  const popularProducts = products.filter((p) => p.is_popular).slice(0, 4);
  const livingRoomProducts = products.filter((p) => p.category_id === 'cat-1' || p.tags?.includes('mehmonxona')).slice(0, 4);
  const bedroomProducts = products.filter((p) => p.category_id === 'cat-2' || p.tags?.includes('yotoqxona')).slice(0, 4);
  const kitchenProducts = products.filter((p) => p.category_id === 'cat-3' || p.tags?.includes('oshxona')).slice(0, 4);
  const officeProducts = products.filter((p) => p.category_id === 'cat-4' || p.tags?.includes('ofis')).slice(0, 4);
  const childrenProducts = products.filter((p) => p.category_id === 'cat-5' || p.tags?.includes('bolalar')).slice(0, 4);
  const discountedProducts = products.filter((p) => Boolean(p.discount_price)).slice(0, 4);

  const activeBanner = banners[activeBannerIdx] || {
    title: `${settings.site_name} - Zamonaviy va Buyurtma Mebellar`,
    subtitle: "Urgutning asriy duradgorlik san'ati va eng so'nggi zamonaviy dizayn texnologiyalari birlashgan maskan.",
    link: "/custom-order",
    image_url: settings.hero_banner_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    button_text: "O‘z O‘lchamingizda Buyurtma Bering"
  };

  const handleCraftsmanRequest = (craftsman) => {
    setSelectedCraftsman(craftsman);
    setIsRequestModalOpen(true);
  };

  return (
    <div>
      {/* 1. PREMIUM HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '640px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(194, 109, 46, 0.25)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--wood-light)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1.25rem',
                border: '1px solid rgba(212, 163, 89, 0.4)'
              }}
            >
              <Sparkles size={15} color="var(--gold-accent)" />
              <span>{settings.hero_badge || "Urgut Hunarmandlari Markazi 2026"}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 24px rgba(0,0,0,0.75)'
              }}
            >
              {activeBanner.title}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
                color: '#e7e5e4',
                lineHeight: 1.6,
                marginBottom: '2rem',
                textShadow: '0 1px 14px rgba(0,0,0,0.85)'
              }}
            >
              {activeBanner.subtitle}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to={activeBanner.link || "/custom-order"} className="btn btn-primary btn-lg">
                <span>{activeBanner.button_text || "Buyurtma Berish"}</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/furniture"
                className="btn btn-secondary btn-lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.25)'
                }}
              >
                <span>Katalogni Ko‘rish</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FURNITURE CATEGORIES */}
      <section style={{ padding: '4.5rem 0 3rem' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag"><Sparkles size={14} /> To‘plamlar</span>
              <h2 className="section-title">Mebel Kategoriyalari</h2>
              <p className="section-subtitle">Xonadoningizning har bir burchagi uchun maxsus loyihalashtirilgan mebel turlari</p>
            </div>
            <Link to="/categories" className="btn btn-secondary btn-sm">
              Barcha kategoriyalar <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Yangi to‘plam</span>
                <h2 className="section-title">Yangi Chiqqan Mebellar</h2>
                <p className="section-subtitle">Urgut ustalarining eng so‘nggi dizayndagi mebel namunalari</p>
              </div>
              <Link to="/furniture?sort=newest" className="btn btn-secondary btn-sm">
                Hammasini ko‘rish <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid-products">
              {newArrivals.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. POPULAR FURNITURE */}
      {popularProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0', backgroundColor: 'transparent' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Eng ko‘p tanlangan</span>
                <h2 className="section-title">Ommabop va Mashhur Mebellar</h2>
                <p className="section-subtitle">Mijozlarimiz eng ko‘p buyurtma berayotgan va yuqori baholagan modellar</p>
              </div>
              <Link to="/furniture?sort=popular" className="btn btn-secondary btn-sm">
                Hammasini ko‘rish <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid-products">
              {popularProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. CUSTOM ORDER PROMOTIONAL SECTION */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <div style={{ padding: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--gold-accent)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.75rem'
                }}
              >
                <Sliders size={16} /> Individual Loyihalar
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  lineHeight: 1.2
                }}
              >
                O‘zingiz Istagan O‘lchamda Mebel Yasating
              </h2>
              <p style={{ color: '#a8a29e', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Xonangiz o‘lchamiga to‘liq mos tushadigan, sifatli tabiiy yog‘och yoki MDF materialidan individual buyurtma bering. Mutaxassislarimiz narxni tezkor hisoblab berishadi.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e7e5e4', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} color="var(--status-success)" />
                  <span>Xonadon o‘lchami va chizmalarni yuklash imkoniyati</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e7e5e4', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} color="var(--status-success)" />
                  <span>Menedjer tomonidan shaffof narx kalkulyatsiyasi</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e7e5e4', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} color="var(--status-success)" />
                  <span>Ishlab chiqarish jarayonini onlayn kuzatish</span>
                </div>
              </div>

              <div>
                <Link to="/custom-order" className="btn btn-primary btn-lg">
                  <PenTool size={18} />
                  <span>Maxsus Buyurtma Shaklini To‘ldirish</span>
                </Link>
              </div>
            </div>

            <div
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '350px'
              }}
            />
          </div>
        </div>
      </section>

      {/* 5. LIVING ROOM FURNITURE */}
      {livingRoomProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Mehmonxona</span>
                <h2 className="section-title">Mehmonxona Mebellari</h2>
                <p className="section-subtitle">Shinamlik va hashamat baxsh etuvchi divanlar va garniturlar</p>
              </div>
              <Link to="/furniture?category=mehmonxona" className="btn btn-secondary btn-sm">
                Barcha mehmonxona mebellari <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-products">
              {livingRoomProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BEDROOM FURNITURE */}
      {bedroomProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0', backgroundColor: 'transparent' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Yotoqxona</span>
                <h2 className="section-title">Yotoqxona Mebellari</h2>
                <p className="section-subtitle">Sokin va orombaxsh uyqu uchun ortopedik karavotlar va shkaflar</p>
              </div>
              <Link to="/furniture?category=yotoqxona" className="btn btn-secondary btn-sm">
                Barcha yotoqxona mebellari <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-products">
              {bedroomProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. KITCHEN FURNITURE */}
      {kitchenProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Oshxona</span>
                <h2 className="section-title">Oshxona Mebellari</h2>
                <p className="section-subtitle">Zamonaviy kvarts va akril fasadli garniturlar hamda stollar</p>
              </div>
              <Link to="/furniture?category=oshxona" className="btn btn-secondary btn-sm">
                Barcha oshxona mebellari <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-products">
              {kitchenProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. OFFICE FURNITURE */}
      {officeProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0', backgroundColor: 'transparent' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Ofis & Ish</span>
                <h2 className="section-title">Ofis va Ish Mebellari</h2>
                <p className="section-subtitle">Ergonomik stollar va qulay kreslolar</p>
              </div>
              <Link to="/furniture?category=ofis" className="btn btn-secondary btn-sm">
                Barcha ofis mebellari <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-products">
              {officeProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. CHILDREN'S FURNITURE */}
      {childrenProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag">Bolalar xonasi</span>
                <h2 className="section-title">Bolalar Mebellari</h2>
                <p className="section-subtitle">Ekologik toza va xavfsiz materiallardan tayyorlangan modellar</p>
              </div>
              <Link to="/furniture?category=bolalar" className="btn btn-secondary btn-sm">
                Barcha bolalar mebellari <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-products">
              {childrenProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. DISCOUNTED FURNITURE */}
      {discountedProducts.length > 0 && (
        <section style={{ padding: '3.5rem 0', backgroundColor: 'transparent' }}>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-tag" style={{ color: '#ef4444' }}>Maxsus Narxlar</span>
                <h2 className="section-title">Chegirmadagi Mebellar</h2>
                <p className="section-subtitle">Cheklangan muddatli qulay takliflar va aksiyadagi to‘plamlar</p>
              </div>
              <Link to="/furniture?discount=true" className="btn btn-secondary btn-sm">
                Barcha chegirmalar <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid-products">
              {discountedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. CRAFTSMEN PREVIEW */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag"><Sparkles size={14} /> Mohir Ustalar</span>
              <h2 className="section-title">Urgut Duradgorlari va Ustaxonalar</h2>
              <p className="section-subtitle">Ko‘p yillik tajribaga ega hunarmandlarimiz bilan to‘g‘ridan-to‘g‘ri hamkorlik qiling</p>
            </div>
            <Link to="/craftsmen" className="btn btn-secondary btn-sm">
              Barcha ustalarni ko‘rish <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            {craftsmen.slice(0, 3).map((craftsman) => (
              <CraftsmanCard
                key={craftsman.id}
                craftsman={craftsman}
                onRequestClick={handleCraftsmanRequest}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 13. CUSTOMER REVIEWS */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="section-tag">Mijozlarimiz Fikri</span>
            <h2 className="section-title">Ishonchli va Sifatli Xizmat</h2>
            <p className="section-subtitle">Bizdan mebel xarid qilgan va buyurtma bergan mijozlarimizning haqiqiy fikrlari</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
              <div style={{ color: 'var(--wood-amber)', marginBottom: '1rem' }}><Quote size={32} /></div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "Urgut mebellari haqiqatdan ham boshqacha! Oshxona garniturimizni yasatdik, har bir burchagi va fitinglari ajoyib ishlangan. Rahmat ustalarga!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  S
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sherzod Aliyev</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toshkent shahri (Tasdiqlangan xarid)</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
              <div style={{ color: 'var(--wood-amber)', marginBottom: '1rem' }}><Quote size={32} /></div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "Yotoqxona to‘plamini buyurtma qildik. Narx taklifi menedjer tomonidan tezkor berildi, ishlab chiqarish jarayonini ham xabardor qilib turishdi. O‘z vaqtida keldi."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  D
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dilnoza Karimova</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Samarqand shahri (Tasdiqlangan xarid)</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
              <div style={{ color: 'var(--wood-amber)', marginBottom: '1rem' }}><Quote size={32} /></div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "Bolalar karavotini tabiiy yog‘ochdan yasatdik. O‘ta baquvvat va bo‘yoqlari mutlaqo xidsiz ekan. Farzandlarim juda xursand!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  J
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Jamshid Qodirov</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Buxoro viloyati</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsman Request Modal */}
      <CraftsmanRequestModal
        craftsman={selectedCraftsman}
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setSelectedCraftsman(null);
        }}
      />
    </div>
  );
};
