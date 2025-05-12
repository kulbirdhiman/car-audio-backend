import { SquareClient } from "square";
import dotenv from "dotenv";
// import { Client } from "square";


dotenv.config();

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN  ,
  environment: "sandbox"  , // Set in .env
});
