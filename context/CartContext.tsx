"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, CartContextType } from "@/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        // Note: les fichiers (logoFile) ne peuvent pas être persistés dans localStorage
        // Seulement logoUrl (base64) est sauvegardé
        setItems(parsedItems);
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (isLoaded) {
      // Sérialiser le panier en excluant les objets File
      const serializableItems = items.map(item => ({
        ...item,
        engraving: item.engraving ? {
          ...item.engraving,
          // On garde logoUrl (base64) mais on retire logoFile (non sérialisable)
          logoFile: undefined,
        } : undefined,
      }));
      localStorage.setItem("cart", JSON.stringify(serializableItems));
    }
  }, [items, isLoaded]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex !== -1) {
        // Remplacer l'item existant par le nouveau (met à jour prix, gravure, etc.)
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = { ...newItem, quantity: 1 };
        return updatedItems;
      }

      // Ajouter le nouvel item
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    const engravingPrice = item.engraving ? item.engraving.price * item.quantity : 0;
    return sum + itemPrice + engravingPrice;
  }, 0);
  const hasAgeRestrictedItems = items.some((item) => item.ageRestricted === true);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        hasAgeRestrictedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
