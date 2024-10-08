import {
  extendType,
  floatArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { Product } from '../entities/Product';
import { Context } from '../types/Context';

export const ProductType = objectType({
  name: 'Product',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('caption');
    t.nonNull.float('price');
    t.nonNull.string('slug');
    t.nonNull.string('weight');
    t.int('rate');
    t.string('description');
    t.string('imageSrc');
  },
});

export const ProductsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('products', {
      type: 'Product',
      args: {
        slug: stringArg(),
      },
      resolve(_parent, args, _context, _info): Promise<Product[]> {
        const { slug } = args;

        return slug ? Product.findBy({ slug: slug }) : Product.find();
      },
    });
  },
});
export const ProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createProduct', {
      type: 'Product',
      args: {
        caption: nonNull(stringArg()),
        price: nonNull(floatArg()),
        slug: nonNull(stringArg()),
        weight: nonNull(stringArg()),
        rate: intArg(),
        description: stringArg(),
      },
      resolve(_parent, args, _context: Context, _info): Promise<Product> {
        const { caption, price, slug, weight, rate, description } = args;
        return Product.create({
          caption,
          price,
          slug,
          weight,
          rate,
          description,
        }).save();
      },
    });
  },
});
