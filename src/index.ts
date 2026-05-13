import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import typeOrmConfig from "./type-orm.config";
import { Context } from "./types/Context";
import { auth } from "./middlewares/auth";
import { uploadRouter } from "./route/upload";
import path from "path";
import cors from "cors";

const boot = async () => {
  const conn = await typeOrmConfig.initialize();

  const app = express();
  app.use(cors());

  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      //credentials: true,
    }),
  );
  app.use((req, _res, next) => {
    console.log("➡️", req.method, req.url);
    next();
  });
  app.use("/upload", uploadRouter);
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  const server = new ApolloServer({
    schema,
    context: ({ req }): Context => {
      const token = req?.headers?.authorization
        ? auth(req.headers.authorization)
        : null;
      return { conn, userId: token?.userId };
    },
  });

  await server.start();

  app.use(server.getMiddleware({ path: '/graphql', cors: false }));

  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

boot();
