import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import typeOrmConfig from "./type-orm.config";
import { Context } from "./types/Context";
import { auth } from "./middlewares/auth";

const boot = async () => {
    try { 
      const conn = await typeOrmConfig.initialize();
      const server = new ApolloServer({
        schema,
        context: ({ req }): Context => {
          const token =
            req && req.headers?.authorization
              ? auth(req.headers.authorization)
              : null;
          return { conn, userId: token ? token.userId : undefined };
        },
      });
  
      server.listen(5001).then(({ url }) => {
        console.log("server running at " + url);
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  boot();