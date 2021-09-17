import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    // TODO
    console.log(sumAmount);
    console.log(product);
    return {};
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      // TODO
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    const chosenProduct = products.find((prod) => prod.id === id);
    localStorage.setItem("RocketShoes:cart", JSON.stringify([chosenProduct]));
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map((prod) => (
        <li key={prod.id}>
          <img src={prod.image} alt={prod.title} />
          <strong>{prod.title}</strong>
          <span>{formatPrice(prod.price)}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(prod.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {/* {cartItemsAmount[product.id] || 0} */} 2
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
