"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { catalog } from "./catalog";
import { track } from "./analytics";

export type CartItem = {
  key: string;
  productId: string;
  variantId: string;
  quantity: number;
  personalization?: {
    name?: string;
    initials?: string;
    text?: string;
  };
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "geschenke_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = [
      item.productId,
      item.variantId,
      item.personalization?.name ?? "",
      item.personalization?.initials ?? "",
      item.personalization?.text ?? "",
    ].join(":");
    setItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) =>
          p.key === key ? { ...p, quantity: p.quantity + item.quantity } : p,
        );
      }
      return [...prev, { ...item, key }];
    });
    track("add_to_cart", { productId: item.productId, variantId: item.variantId });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
    track("remove_from_cart", { key });
  }, []);

  const updateQty = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.key === key ? { ...p, quantity } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotalCents = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = catalog.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return sum;
      const personalized = Boolean(
        item.personalization?.name ||
          item.personalization?.initials ||
          item.personalization?.text,
      );
      const unit =
        variant.price_cents +
        (personalized ? variant.personalization_price_cents : 0);
      return sum + unit * item.quantity;
    }, 0);
  }, [items]);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, count, subtotalCents }),
    [items, addItem, removeItem, updateQty, clear, count, subtotalCents],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
