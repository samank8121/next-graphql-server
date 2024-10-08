import { extendType, nonNull, stringArg, objectType } from 'nexus';
import { User } from '../entities/User';
import { Context } from '../types/Context';
import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export const AuthenticationType = objectType({
  name: 'AuthenticationType',
  definition(t) {
    t.nonNull.string('token'),
      t.nonNull.field('user', {
        type: 'User',
      });
  },
});

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'AuthenticationType',
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, _context: Context, _info) {
        const { username, password } = args;
        const user = await User.findOne({ where: { username } });

        if (!user) {
          throw new Error('User not found');
        }

        const isValid = await argon2.verify(user.password, password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.TOKEN_SECRET_KEY as jwt.Secret
        );

        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field('register', {
      type: 'AuthenticationType',
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        const { username, password, email } = args;
        const duplicateUser = await User.findOne({
          where: [{ username: username }, { email: email }],
        });
        if (duplicateUser) {
          throw new Error('Duplicate user');
        }
        const hashedPassword = await argon2.hash(password);
        let user;
        let token;
        try {
          const result = await context.conn
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
              username,
              password: hashedPassword,
              email,
            })
            .returning('*')
            .execute();
          user = result.raw[0];
          token = await jwt.sign(
            { userId: user.id },
            process.env.TOKEN_SECRET_KEY as jwt.Secret
          );
        } catch (err) {
          console.log(err);
        }

        return {
          user,
          token,
        };
      },
    });
  },
});
