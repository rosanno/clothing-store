import axios from "axios";
import { createContext, useState } from "react";

export const CartContext = createContext<any>({});

export const CartContextProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState<any>([]);

  const getItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/users/cart");
      setCartCount(data);
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const decreaseCart = (id: number) => {
    const newCartLength = cartCount.filter((c: any) => c.Products.id !== id);
    setCartCount(newCartLength);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        getItems,
        decreaseCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
