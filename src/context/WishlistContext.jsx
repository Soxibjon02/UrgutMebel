import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { dataService } from '../services/dataService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_mebel_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_mebel_likes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('urgut_mebel_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('urgut_mebel_likes', JSON.stringify(likes));
  }, [likes]);

  const toggleFavorite = (product) => {
    if (isGuest) {
      openAuthModal('login', 'Mahsulotni istaklar ro‘yxatiga qo‘shish uchun hisobingizga kiring!');
      return false;
    }

    const isFav = favorites.some((f) => f.id === product.id);
    if (isFav) {
      setFavorites((prev) => prev.filter((f) => f.id !== product.id));
      addToast(`"${product.name}" sevimlilardan olib tashlandi`, 'info');
      return false;
    } else {
      setFavorites((prev) => [product, ...prev]);
      addToast(`"${product.name}" sevimlilar ro‘yxatiga qo‘shildi!`, 'success');
      return true;
    }
  };

  const isFavorite = (productId) => favorites.some((f) => f.id === productId);

  const toggleLike = async (productId) => {
    if (isGuest) {
      openAuthModal('login', 'Mebelga layk bosish uchun avval tizimga kiring!');
      return false;
    }

    const isLiked = likes.includes(productId);
    if (isLiked) {
      setLikes((prev) => prev.filter((id) => id !== productId));
      await dataService.toggleProductLike(productId, -1);
      return false;
    } else {
      setLikes((prev) => [...prev, productId]);
      await dataService.toggleProductLike(productId, 1);
      addToast('Mebelga layk bosildi!', 'success');
      return true;
    }
  };

  const isLiked = (productId) => likes.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        likes,
        toggleLike,
        isLiked,
        favoritesCount: favorites.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
