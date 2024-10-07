import { extendType, intArg, nonNull, objectType } from "nexus";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { Context } from "../types/Context";
import { CartProduct } from "../entities/CartProduct";

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
    t.list.field("cartProducts", {
      type: "CartProduct",
      resolve(parent, _args, _context) {
        return CartProduct.find({
          where: { cartId: parent.id },
        });
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
        productId: nonNull(intArg()),
      },
      async resolve(_parent, { productId }, context: Context) {
        const { userId } = context;

        if (!userId) {
          throw new Error("Can't add product to cart without logging in.");
        }

        let cart = await Cart.findOne({ where: { userId: userId }, relations: ["cartProducts"] });
        if (!cart) {
          cart = await Cart.create({ userId }).save();
        }

        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
          throw new Error("Product not found");
        }

        let cartProduct = await CartProduct.findOne({
          where: { cart: { id: cart.id }, product: { id: productId } },
        });

        if (cartProduct) {
          cartProduct.productCount += 1;
          await cartProduct.save();
        } else {
          cartProduct = await CartProduct.create({
            cart: cart,
            product: product,
            productCount: 1, 
          }).save();
        }

        cart = await Cart.findOne({ where: { id: cart.id }, relations: ["cartProducts", "cartProducts.product"] });
        return cart;
      },
    });
  },
});
