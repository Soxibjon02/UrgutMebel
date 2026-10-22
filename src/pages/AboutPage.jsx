import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Award, ShieldCheck, Clock, Users, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const title = settings.about_title || `${settings.site_name} Haqida`;
  const subtitle = settings.about_subtitle || settings.site_tagline || "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi";
  const badge = settings.about_badge || "Tarix & Mahorat";

  const storyTitle = settings.about_story_title || "Urgut Duradgorlarining Asriy Merosi";
  const storyP1 = settings.about_story_p1 || "Samarqand viloyatining Urgut tumani qadim zamonlardan beri hunarmandchilik, ayniqsa yog‘ochsozlik va mebelchilik maktabi bilan butun O‘rta Osiyoda dong taratgan.";
  const storyP2 = settings.about_story_p2 || "Biz ushbu asriy tajribani eng so‘nggi Germaniya va Italiya texnologiyalari (CNC kesish, avstriyalik Blum fitinglari, ekologik xavfsiz bo‘yoqlar) bilan birlashtirib, har bir xonadonga ko‘p yillar xizmat qiluvchi hashamatli va qulay mebellarni taqdim etamiz.";
  const storyImage = settings.about_image_url || "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80";
  const btnText = settings.about_btn_text || t('custom_order.send_request', "Maxsus Buyurtma Berish");
  const btnUrl = settings.about_btn_url || "/custom-order";

  const stats = [
    { number: settings.about_stat1_number || "25+", label: settings.about_stat1_label || t('craftsmen.experience', "Yillik Tajriba") },
    { number: settings.about_stat2_number || "10,000+", label: settings.about_stat2_label || t('nav.catalog', "Mebellar") },
    { number: settings.about_stat3_number || "98%", label: settings.about_stat3_label || t('about.happy_customers', "Mamnun Mijozlar") },
    { number: settings.about_stat4_number || "5 Yil", label: settings.about_stat4_label || t('footer.features_warranty_title', "Rasmiy Kafolat") }
  ];

  const values = [
    {
      icon: Award,
      title: settings.about_val1_title || t('hero.quality_materials', "100% Tabiiy Massiv"),
      desc: settings.about_val1_desc || "Quritilgan eman, yong‘oq va qarag‘ay daraxtlaridan foydalanamiz. Mebellar yorilmaydi va qiyshaymaydi."
    },
    {
      icon: ShieldCheck,
      title: settings.about_val2_title || t('footer.features_warranty_title', "Rasmiy Kafolat"),
      desc: settings.about_val2_desc || "Har bir ishlab chiqarilgan mebel uchun 3 yildan 5 yilgacha rasmiy kafolat va servis xizmati beriladi."
    },
    {
      icon: Users,
      title: settings.about_val3_title || t('footer.features_craftsmen_title', "200+ Mohir Usta"),
      desc: settings.about_val3_desc || "Platformamiz orqali Urgutning eng sara mebel ustalari bilan bevosita bog‘lanib, buyurtma berishingiz mumkin."
    }
  ];

  return (
    <div style={{ padding: '3.5rem 0 6rem', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(194, 109, 46, 0.15)',
              color: 'var(--wood-amber)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '1rem',
              border: '1px solid rgba(194, 109, 46, 0.3)'
            }}
          >
            <Sparkles size={15} />
            <span>{badge}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            {title}
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2.5rem', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.3 }}>
              {storyTitle}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '1rem' }}>
              {storyP1}
            </p>
            {storyP2 && (
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.75rem', fontSize: '1rem' }}>
                {storyP2}
              </p>
            )}
            <Link to={btnUrl} className="btn btn-primary" style={{ padding: '0.85rem 1.6rem', fontWeight: 700 }}>
              {btnText} <ArrowRight size={17} />
            </Link>
          </div>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
            <img
              src={storyImage}
              alt={storyTitle}
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>
        </div>

        {/* 4 Stats Cards Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem',
            padding: '2rem',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
          className="glass-card"
        >
          {stats.map((s, idx) => (
            <div key={idx} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--gold-accent)', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                {s.number}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pillars / Values Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('about.values_title', 'Bizning Asosiy Tamoyillarimiz')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('about.values_desc', 'Har bir ishlab chiqarilgan mebel ortida mas\'uliyat va qat\'iy standartlar turadi')}</p>
        </div>

        {/* Pillars / Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
                className="glass-card"
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)' }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{val.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

