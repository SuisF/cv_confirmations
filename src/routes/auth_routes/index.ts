import { Express } from "express";
import { AuthController } from "../../controller/auth.controller";

export default function AuthRoutes(authRoutes: Express) {
  const authController = new AuthController();

  authRoutes.post(`/v1/signup`, authController.signUp);
  authRoutes.post(`/v1/signin`, authController.signIn);
}
