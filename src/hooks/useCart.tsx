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

      const isProductInCart =
        cart.find((item) => item.id === addedProduct.id) !== undefined;

      if (!isProductInCart) {
        if (addedProductStockAmount.amount > 0) {
          const newCart = [...cart, { ...addedProduct, amount: 1 }];
          setCart(newCart);
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
        } else {
          toast.error("Quantidade solicitada fora de estoque");
        }
      }

      if (isProductInCart) {
        const updateProduct = cart.find((item) => item.id === addedProduct.id);
        if (
          updateProduct &&
          updateProduct.amount < addedProductStockAmount.amount
        ) {
          console.log(updateProduct);
          const cartWithUpdateProduct = cart.map((item) =>
            item.id === addedProduct.id
              ? { ...item, amount: item.amount + 1 }
              : item
          );
          setCart(cartWithUpdateProduct);
          localStorage.setItem(
            "@RocketShoes:cart",
            JSON.stringify(cartWithUpdateProduct)
          );
        } else {
          toast.error("Quantidade solicitada fora de estoque");
        }
      }
    } catch {
      // TODO
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const isProductInCart =
        cart.find((item) => item.id === productId) !== undefined;

      if (isProductInCart) {
        const newCart = cart.filter((product) => product.id !== productId);
        setCart(newCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
      } else {
        toast.error("Erro na remoção do produto");
      }
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
        addedProductStockAmount.amount > productToBeUpdated.amount
      ) {
        const newCart = cart.map((product) =>
          product.id === productToBeUpdated.id
            ? { ...product, amount: amount }
            : product
        );
        setCart(newCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
      } else {
        toast.error("Quantidade solicitada fora de estoque");
      }
    } catch {
      // TODO
      toast.error("Erro na alteração de quantidade do produto");
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
