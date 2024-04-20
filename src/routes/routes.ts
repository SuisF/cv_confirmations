import bodyParser from "body-parser";
import cors from "cors";
import { Express, Request, Response } from "express";
import AuthRoutes from "./auth_routes";
import CVRoutes from "./cv_routes";
import multer, { diskStorage } from "multer";


export default function Routes(app: Express) {
    
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyParser.json());

  app.get("/", function (req: Request, res: Response) {
    res.status(200).json({
      message: "Connected",
    });
  });

  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "images/profile_picture");
      },
      filename: function (req, file, cb) {
        const getMonth = new Date().getMonth() + 1;
        const getDay = new Date().getDay();
        const randomString5Length = Math.random().toString(36).substring(2, 15);

        const getPathExt = file.originalname.split(".")[1];
        cb(
          null,
          file.fieldname +
            "_" +
            randomString5Length +
            "_" +
            getDay +
            "" +
            getMonth +
            "." +
            getPathExt
        );
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error("Only image or webp files are allowed!"));
      }
      cb(null, true);
    },
  });

  AuthRoutes(app);
  CVRoutes(app, upload);
}
