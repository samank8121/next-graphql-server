import { extendType, objectType } from 'nexus';
import { Cart } from '../entities/Cart';
import { User } from '../entities/User';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('username');
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.nonNull.field('cart', {
      type: 'Cart',
      resolve(parent, _args, _context): Promise<Cart[]> {
        return Cart.find({ where: { id: parent.cartId } });
      },
    });
  },
});
export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      resolve(_parent, _args, _context, _info): Promise<User[]> {
        return User.find();
      },
    });
  },
});
