import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const { data: addedProduct }: { data: Product } = await api.get(
        `/products/${productId}`
      );
      const { data: addedProductStockAmount }: { data: Stock } = await api.get(
        `/stock/${productId}`
      );

      const cartHasAddedProduct = cart.find((item) => item.id === productId);
      const stockHasAddedProduct =
        addedProduct.amount > addedProductStockAmount.amount ? false : true;

      if (cartHasAddedProduct) {
        toast.error("Este produto já existe no carrinho");
      } else if (!cartHasAddedProduct && stockHasAddedProduct) {
        setCart([...cart, { ...addedProduct, amount: 1 }]);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify([cart]));
      } else if (cartHasAddedProduct && !stockHasAddedProduct) {
        toast.error("Quantidade solicitada fora de estoque");
      }
    } catch {
      // TODO
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const newCart = cart.filter((product) => product.id !== productId);
      setCart(newCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify([newCart]));
    } catch {
      // TODO
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      const { data: addedProductStockAmount }: { data: Stock } = await api.get(
        `/stock/${productId}`
      );
      const productToBeUpdated = cart.find(
        (product) => product.id === productId
      );

      if (
        productToBeUpdated &&
        addedProductStockAmount.amount >= productToBeUpdated.amount
      ) {
        const newCart = cart.map((product) =>
          product.id === productToBeUpdated.id
            ? { ...product, amount: amount }
            : product
        );
        setCart(newCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify([newCart]));
      } else {
        toast.error("Quantidade solicitada fora de estoque");
      }
    } catch {
      // TODO
      toast.error("Quantidade solicitada fora de estoque");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
