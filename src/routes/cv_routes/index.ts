import { Express } from "express";
import multer from "multer";
import { CVController } from "../../controller/cv.controller";
import { middlewareAuth } from "../../middleware/auth";

export default function CVRoutes(cvRoutes: Express, upload: multer.Multer) {
  const cvController = new CVController();

  const middlewareJwt = new middlewareAuth();

  cvRoutes.get("/v1/cv", middlewareJwt.authenticationToken, cvController.getCV);
  cvRoutes.post(
    "/v1/create-cv",
    middlewareJwt.authenticationToken,
    upload.single("profile_pict"),
    cvController.createCV
  );
  cvRoutes.put(
    "/v1/update-cv/:id",
    middlewareJwt.authenticationToken,
    upload.single("profile_pict"),
    cvController.updateCV
  );
  cvRoutes.delete(
    "/v1/delete-cv/:id",
    middlewareJwt.authenticationToken,
    cvController.deleteCV
  );
}
