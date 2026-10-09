import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addToast } = useNotification();
  const { isGuest, openAuthModal } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_mebel_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('urgut_mebel_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product_id === product.id && item.selected_color === (selectedColor || product.colors?.[0])
      );
      if (existing) {
        addToast(`"${product.name}" savatda soni oshirildi (+${quantity})`, 'info');
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const itemPrice = product.discount_price || product.price;
        addToast(`"${product.name}" savatga qo‘shildi!`, 'success');
        return [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            price: itemPrice,
            original_price: product.price,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
            selected_color: selectedColor || product.colors?.[0] || 'Standart',
            material: product.material,
            quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, selectedColor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId && item.selected_color === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, selectedColor) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product_id === productId && item.selected_color === selectedColor)
      )
    );
    addToast('Mahsulot savatdan olib tashlandi', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
