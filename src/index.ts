import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import Routes from "./routes/routes";
import cors from "cors";
import expressJSDocSwagger from "express-jsdoc-swagger";
import { swaggerOptions } from "./vendor/swagger"
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3500;
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))

// init Swagger for docs
expressJSDocSwagger(app)(swaggerOptions);

Routes(app);

app.listen(port, () => {
  prisma
    .$connect()
    .then(() => {
      console.log(`
        => Successfully Run                              
        => Mode ${process.env.NODE_ENV}
        => Running on ${process.env.PORT}
        => Database Connected :)
        `);
    })
    .catch((err: any) => {
      console.log(`Database is not connected: ${err}`);
      process.exit(1);
    });
});
