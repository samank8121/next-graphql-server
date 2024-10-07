import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
import { User } from "./entities/User";
import { Cart } from "./entities/Cart";
import dotenv from "dotenv";
import { CartProduct } from "./entities/CartProduct";

dotenv.config();

export default new DataSource({
  entities: [Product, User, Cart, CartProduct],
  type: "postgres",
  url: process.env.CONNECTION_STRING,
  synchronize: true,
});