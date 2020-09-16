import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    console.log('cartTotal');
    if (products.length) {
      const reducer = (accumulator: number, currentValue: number): number =>
        accumulator + currentValue;
      const total = products
        .map(prod => {
          return prod.price * prod.quantity;
        })
        .reduce(reducer);
      console.log(total);
      return formatValue(total);
    }

    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    console.log('totalItensInCart');
    if (products.length) {
      const reducer = (accumulator: number, currentValue: number): number =>
        accumulator + currentValue;
      const total = products
        .map(prod => {
          return prod.quantity;
        })
        .reduce(reducer);
      return total;
    }

    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
