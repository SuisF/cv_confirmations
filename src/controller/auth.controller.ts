import { Request, Response } from "express";
import Joi from "joi";
import { AuthServiceImpl } from "../services/auth.service";
import { signUpForm, signInForm } from "../dto/auth.dto";
import bcrypt from "bcrypt";

export class AuthController {

  /**
   * POST /v1/signup
   * @summary User Sign Up
   * @tags Auth
   * @param {string} username.form.required - form data - application/x-www-form-urlencoded
   * @param {string} name.form.required - form data - application/x-www-form-urlencoded
   * @param {string} password.form.required - form data - application/x-www-form-urlencoded
   * @return {object} 201 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async signUp(req: Request, res: Response) {
    const signUpData: signUpForm = req.body;
    const authService = new AuthServiceImpl();

    const schema = Joi.object()
      .keys({
        username: Joi.string().min(6).required().messages({
          "string.min": "Username must be atleast 6 characters",
          "any.required": "Username cannot be empty",
        }),
        name: Joi.string().required().messages({
          "any.required": "Name cannot be empty",
        }),
        password: Joi.string().min(6).required().messages({
          "string.min": "Password must be atleast 6 characters",
          "any.required": `Password cannot be empty`,
        }),
      })
      .unknown(true);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    const hash = bcrypt.hashSync(signUpData.password, salt);

    const { error, value } = schema.validate(req.body);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(","),
        error: true,
      });
    } else {
      const [success, error] = await authService.signUp(signUpData, hash);
      if (error.error) {
        return res.status(error.status).json(error);
      } else {
        res.status(success.status).json(success);
      }
    }
  }

  /**
   * POST /v1/signin
   * @summary User Sign In
   * @tags Auth
   * @param {string} username.form.required - form data - application/x-www-form-urlencoded
   * @param {string} password.form.required - form data - application/x-www-form-urlencoded
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async signIn(req: Request, res: Response) {
    const schema = Joi.object()
      .keys({
        username: Joi.string().min(6).required().messages({
          "string.min": "Username must be atleast 6 characters",
          "any.required": "Username cannot be empty",
        }),
        password: Joi.string().min(6).required().messages({
          "string.min": "Password must be atleast 6 characters",
          "any.required": `Password cannot be empty`,
        }),
      })
      .unknown(true);

    const authService = new AuthServiceImpl();
    const reqForm: signInForm = {
      ...req.body,
    };

    const { error, value } = schema.validate(req.body);
    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(","),
        error: true,
      });
    } else {
      const [success, error] = await authService.signIn(reqForm);
      if (error.error) {
        return res.status(error.status).json(error);
      } else {
        res.status(success.status).json(success);
      }
    }
  }
}
