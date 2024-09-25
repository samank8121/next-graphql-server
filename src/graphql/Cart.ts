import { extendType, intArg, nonNull, objectType } from "nexus";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";

export const CartType = objectType({
  name: "Cart",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("userId");
    t.nonNull.field("user", {
      type: "User",
      resolve(parent, _args, _context): Promise<User[]> {
        return User.find({ where: { id: parent.userId } });
      },
    });
  },
});
export const CartsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('carts', {
      type: 'Cart',
      resolve(_parent, _args, _context, _info): Promise<Cart[]> {
        return Cart.find();
      },
    });
  },
});

export const CartMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addProductToCart", {
      type: "Cart",
      args: {
        cartId: nonNull(intArg()),
        productId: nonNull(intArg()),
      },
      async resolve(_parent, { cartId, productId }, _context) {
        const cart = await Cart.findOne({ where: { id: cartId }, relations: ["products"] });
        if (!cart) {
          throw new Error("Cart not found");
        }

        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
          throw new Error("Product not found");
        }

        if (!cart.products) {
          cart.products = [];
        }

        const productAlreadyInCart = cart.products.some((p) => p.id === productId);
        if (!productAlreadyInCart) {
          cart.products.push(product);
        } else {
          throw new Error("Product is already in the cart");
        }
        await cart.save();

        return cart;
      },
    });
  },
});
