import { objectType } from 'nexus';
import { Product } from '../entities/Product';
import { Cart } from '../entities/Cart';

export const CartProduct = objectType({
  name: 'CartProduct',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('productCount');
    t.field('product', {
      type: 'Product',
      resolve(parent, _args, _context) {
        return Product.findOne({
          where: { id: parent.productId },
        });
      },
    });
    t.field('cart', {
      type: 'Cart',
      resolve(parent, _args, _context) {
        return Cart.findOne({
          where: { id: parent.cartId },
        });
      },
    });
  },
});
