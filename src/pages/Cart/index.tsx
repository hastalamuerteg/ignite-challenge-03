import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, updateProductAmount, removeProduct } = useCart();

  const cartFormatted = cart.map((product) => ({
    // TODO
    ...product,
    priceFormatted: formatPrice(product.price),
    subTotal: formatPrice(product.price * product.amount),
  }));

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      return sumTotal + product.price * product.amount;
    }, 0)
  );

  function handleProductIncrement(product: Product) {
    //TODO
    if (product) {
      updateProductAmount({
        productId: product.id,
        amount: product.amount + 1,
      });
    }
  }

  function handleProductDecrement(product: Product) {
    // TODO
    if (product) {
      updateProductAmount({
        productId: product.id,
        amount: product.amount - 1,
      });
    }
  }

  function handleRemoveProduct(productId: number) {
    // TODO
    if (productId) {
      removeProduct(productId);
    }
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.length > 0 ? (
            cartFormatted.map((item) => (
              <tr data-testid="product" key={item.id}>
                <td>
                  <img src={item.image} alt={item.title} />
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <span>{item.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={item.amount <= 1}
                      onClick={() => handleProductDecrement(item)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={item.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(item)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{item.subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(item.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>Carrinho vazio</td>
            </tr>
          )}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
