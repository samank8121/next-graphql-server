import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
import { User } from "./entities/User";
import { Cart } from "./entities/Cart";
import dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  entities: [Product, User, Cart],
  type: "postgres",
  url: process.env.CONNECTION_STRING,
  synchronize: true,
});