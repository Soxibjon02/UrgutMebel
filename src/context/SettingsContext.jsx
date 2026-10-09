import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
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
  });

  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await dataService.getSettings();
        if (data) {
          setSettings(data);
          document.title = `${data.site_name} - Zamonaviy va Buyurtma Mebellar`;
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
        setSettings(e.detail);
        document.title = `${e.detail.site_name} - Zamonaviy va Buyurtma Mebellar`;
      }
    };
    window.addEventListener('urgut_store_settings_updated', handleUpdate);
    return () => window.removeEventListener('urgut_store_settings_updated', handleUpdate);
  }, []);

  // Super Admin updates Web Project Name & Platform configuration
  const updateSettings = async (newValues) => {
    const updated = await dataService.updateSettings(newValues);
    setSettings(updated);
    document.title = `${updated.site_name} - Zamonaviy va Buyurtma Mebellar`;
    return updated;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
