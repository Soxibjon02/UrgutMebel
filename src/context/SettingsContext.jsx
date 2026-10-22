import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const SettingsContext = createContext();

export const defaultSettings = {
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
  announcement: "Bahorgi aksiya: barcha yotoqxona to‘plamlariga 15% gacha chegirma!",
  working_hours: "Har kuni 08:30 dan 20:00 gacha (Dam olish kunlarisiz)",
  footer_about: "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi. Har bir xonadon uchun sifatli, qulay va uzoq yillik mebellar.",
  copyright_text: "© 2026 Urgut Mebel Markazi. Barcha huquqlar himoyalangan.",
  feature1_title: "Tezkor Yetkazib Berish",
  feature1_desc: "Butun O‘zbekiston bo‘ylab professional yetkazib berish va o‘rnatish",
  feature2_title: "Rasmiy Kafolat",
  feature2_desc: "Har bir mebel uchun 3 yildan 5 yilgacha sifat kafolati",
  feature3_title: "Urgut Duradgorlari",
  feature3_desc: "Asriy hunarmandchilik an'analari va zamonaviy texnologiya uyg'unligi",
  hero_banner_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  hero_title: "",
  hero_subtitle: "",
  hero_btn_text: "O‘z O‘lchamingizda Buyurtma Bering",
  hero_btn_link: "/custom-order",
  logo_url: "/pwa-icon.svg",

  // Biz Haqimizda (About Page) dynamic settings
  about_title: "Urgut Mebel Markazi Haqida",
  about_subtitle: "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi",
  about_badge: "Tarix & Mahorat",
  about_story_title: "Urgut Duradgorlarining Asriy Merosi",
  about_story_p1: "Samarqand viloyatining Urgut tumani qadim zamonlardan beri hunarmandchilik, ayniqsa yog‘ochsozlik va mebelchilik maktabi bilan butun O‘rta Osiyoda dong taratgan.",
  about_story_p2: "Biz ushbu asriy tajribani eng so‘nggi Germaniya va Italiya texnologiyalari (CNC kesish, avstriyalik Blum fitinglari, ekologik xavfsiz bo‘yoqlar) bilan birlashtirib, har bir xonadonga ko‘p yillar xizmat qiluvchi hashamatli va qulay mebellarni taqdim etamiz.",
  about_image_url: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80",
  about_btn_text: "Maxsus Buyurtma Berish",
  about_btn_url: "/custom-order",
  about_stat1_number: "25+",
  about_stat1_label: "Yillik Tajriba",
  about_stat2_number: "10,000+",
  about_stat2_label: "Tayyorlangan Mebellar",
  about_stat3_number: "98%",
  about_stat3_label: "Mamnun Mijozlar",
  about_stat4_number: "5 Yil",
  about_stat4_label: "Rasmiy Kafolat",
  about_val1_title: "100% Tabiiy Massiv",
  about_val1_desc: "Quritilgan eman, yong‘oq va qarag‘ay daraxtlaridan foydalanamiz. Mebellar yorilmaydi va qiyshaymaydi.",
  about_val2_title: "Rasmiy Kafolat",
  about_val2_desc: "Har bir ishlab chiqarilgan mebel uchun 3 yildan 5 yilgacha rasmiy kafolat va servis xizmati beriladi.",
  about_val3_title: "200+ Mohir Usta",
  about_val3_desc: "Platformamiz orqali Urgutning eng sara mebel ustalari bilan bevosita bog‘lanib, buyurtma berishingiz mumkin."
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_mebel_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading cached settings:', e);
    }
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  // Theme: Dark Mode by default
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_theme');
      if (saved) return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('urgut_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await dataService.getSettings();
        if (data) {
          setSettings({ ...defaultSettings, ...data });
          document.title = `${data.site_name || defaultSettings.site_name} - Zamonaviy va Buyurtma Mebellar`;
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Listen for live settings update event across tabs or windows
    const handleUpdate = (e) => {
      if (e.detail) {
        setSettings({ ...defaultSettings, ...e.detail });
        document.title = `${e.detail.site_name || defaultSettings.site_name} - Zamonaviy va Buyurtma Mebellar`;
      }
    };
    window.addEventListener('urgut_store_settings_updated', handleUpdate);
    return () => window.removeEventListener('urgut_store_settings_updated', handleUpdate);
  }, []);

  // Super Admin updates Web Project Name, Header, Footer & Platform configuration
  const updateSettings = async (newValues) => {
    const updated = await dataService.updateSettings(newValues);
    setSettings(updated);
    document.title = `${updated.site_name || defaultSettings.site_name} - Zamonaviy va Buyurtma Mebellar`;
    return updated;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        loading,
        theme,
        toggleTheme,
        isDark: theme === 'dark'
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
