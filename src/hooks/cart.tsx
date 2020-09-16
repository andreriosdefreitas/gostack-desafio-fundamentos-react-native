import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const keys: string[] = await AsyncStorage.getAllKeys();
      const productsStorageds = await AsyncStorage.multiGet(keys);
      const prods: Product[] = [];
      productsStorageds.forEach(prod => {
        if (prod[1]) {
          const p: string = prod[1];
          const product: Product = JSON.parse(p);
          prods.push(product);
        }
      });
      setProducts(prods);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const existProduct = await AsyncStorage.getItem(product.id);
      if (existProduct) {
        const p: Product = JSON.parse(existProduct);
        p.quantity += 1;
        await AsyncStorage.setItem(p.id, JSON.stringify(p));
        const prods = products.map(prod => {
          if (prod.id === p.id) {
            return p;
          }
          return prod;
        });
        setProducts(prods);
      } else {
        const { id, title, image_url, price, quantity = 1 }: Product = product;
        const newProd: Product = {
          id,
          title,
          image_url,
          price,
          quantity,
        };
        await AsyncStorage.setItem(product.id, JSON.stringify(newProd));
        setProducts([...products, newProd]);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const existProduct = await AsyncStorage.getItem(id);
      if (existProduct) {
        const p: Product = JSON.parse(existProduct);
        p.quantity += 1;
        await AsyncStorage.setItem(p.id, JSON.stringify(p));
        const prods = products.map(prod => {
          if (prod.id === p.id) {
            return p;
          }
          return prod;
        });
        setProducts(prods);
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const existProduct = await AsyncStorage.getItem(id);
      if (existProduct) {
        const p: Product = JSON.parse(existProduct);
        if (p.quantity > 1) {
          p.quantity -= 1;
          await AsyncStorage.setItem(p.id, JSON.stringify(p));
          const prods = products.map(prod => {
            if (prod.id === p.id) {
              return p;
            }
            return prod;
          });
          setProducts(prods);
        } else {
          await AsyncStorage.removeItem(id);
          const prods = products.filter(prod => {
            return prod.id !== id;
          });
          setProducts(prods);
        }
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
