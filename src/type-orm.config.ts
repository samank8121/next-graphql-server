import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
//import { User } from "./entities/User";
import dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  //entities: [Product, User],
  entities: [Product],
  type: "postgres",
  url: process.env.CONNECTION_STRING,
  synchronize: true,
});