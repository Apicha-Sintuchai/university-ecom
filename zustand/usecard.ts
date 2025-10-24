import { create } from "zustand";

type Product = {
  productname: string;
  price: number;
};

type CartState = {
  cart: Product[];
  addToCart: (product: Product) => void;
};

export const useCart = create<CartState>((set) => ({
  cart: [],
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
}));
