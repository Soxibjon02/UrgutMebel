import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Award, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-tag"><Sparkles size={14} /> Tarix & Mahorat</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem' }}>
            {settings.site_name} Haqida
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {settings.site_tagline || "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi"}
          </p>
        </div>

        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>
              Urgut Duradgorlarining Asriy Merosi
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Samarqand viloyatining Urgut tumani qadim zamonlardan beri hunarmandchilik, ayniqsa yog‘ochsozlik va mebelchilik maktabi bilan butun O‘rta Osiyoda dong taratgan.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Biz ushbu asriy tajribani eng so‘nggi Germaniya va Italiya texnologiyalari (CNC kesish, avstriyalik Blum fitinglari, ekologik xavfsiz bo‘yoqlar) bilan birlashtirib, har bir xonadonga ko‘p yillar xizmat qiluvchi hashamatli va qulay mebellarni taqdim etamiz.
            </p>
            <Link to="/custom-order" className="btn btn-primary">
              Maxsus Buyurtma Berish <ArrowRight size={17} />
            </Link>
          </div>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img
              src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80"
              alt="Urgut Mebellari"
              style={{ width: '100%', height: '380px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Pillars / Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', marginBottom: '1rem' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>100% Tabiiy Massiv</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Quritilgan eman, yong‘oq va qarag‘ay daraxtlaridan foydalanamiz. Mebellar yorilmaydi va qiyshaymaydi.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Rasmiy Kafolat</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Har bir ishlab chiqarilgan mebel uchun 3 yildan 5 yilgacha rasmiy kafolat va servis xizmati beriladi.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>200+ Mohir Usta</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Platformamiz orqali Urgutning eng sara mebel ustalari bilan bevosita bog‘lanib, buyurtma berishingiz mumkin.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
