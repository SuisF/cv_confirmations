import { Request, Response } from "express";
import Joi, { string } from "joi";
import { CVServiceImpl } from "../services/cv.service";
import { cvForm } from "../dto/cv.dto";

export class CVController {
  /**
   * GET /v1/cv
   * @summary Get All CV
   * @tags CV
   * @security BasicAuth | BearerAuth
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async getCV(req: Request, res: Response) {
    const cvService = new CVServiceImpl();
    const [success, error] = await cvService
      .getCV
      // String(req.body.token)
      ();

    if (error.error) {
      return res.status(error.status).json(error);
    } else {
      return res.status(success.status).json(success);
    }
  }

  /**
   * POST /v1/create-cv
   * @summary Create CV
   * @tags CV
   * @security BasicAuth | BearerAuth
   * @param {string} name.form.required - form data - multipart/form-data
   * @param {string} position.form.required - form data - multipart/form-data
   * @param {file} profile_pict.form.required - file data - multipart/form-data
   * @param {string} about_me.form.required - form data - multipart/form-data
   * @param {string} contact.form.required - form data - multipart/form-data
   * @param {string} experience.form.required - form data - multipart/form-data
   * @param {string} skills.form.required - form data - multipart/form-data
   * @param {string} education.form.required - form data - multipart/form-data
   * @param {string} language.form.required - form data - multipart/form-data
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async createCV(req: Request, res: Response) {
    const reqForm: cvForm = {
      name: req.body.name,
      position: req.body.position,
      profile_pict: req.file?.filename as string,
      about_me: req.body.about_me,
      contact: req.body.contact,
      experience: req.body.experience,
      skills: req.body.skills,
      education: req.body.education,
      language: req.body.language,
      createdAt: new Date(),
    };

    const cvService = new CVServiceImpl();

    const schema = Joi.object()
      .keys({
        name: Joi.string().required().messages({
          "any.required": "Name cannot be empty",
        }),
        position: Joi.string().required().messages({
          "any.required": "Position cannot be empty",
        }),
        contact: Joi.string().required().messages({
          "any.required": "Contact cannot be empty",
        }),
        skills: Joi.string().required().messages({
          "any.required": "Skills cannot be empty",
        }),
        education: Joi.string().required().messages({
          "any.required": "Education cannot be empty",
        }),
        language: Joi.string().min(2).required().messages({
          "string.min": "Language must be atleast 2 characters",
          "any.required": "Language cannot be empty",
        }),
      })
      .unknown(true);

    const { error, value } = schema.validate(reqForm);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join("."),
        error: true,
      });
    } else {
      const [success, error] = await cvService.createCV(
        reqForm
        //String(req.body.token)
      );
      if (error.error) {
        return res.status(error.status).json(error);
      } else {
        return res.status(success.status).json(success);
      }
    }
  }

  /**
   * PUT /v1/update-cv/{id}
   * @summary Update CV
   * @tags CV
   * @security BasicAuth | BearerAuth
   * @param {number} id.path - id
   * @param {string} name.form.required - form data - multipart/form-data
   * @param {string} position.form.required - form data - multipart/form-data
   * @param {file} profile_pict.form.required - file data - multipart/form-data
   * @param {string} about_me.form.required - form data - multipart/form-data
   * @param {string} contact.form.required - form data - multipart/form-data
   * @param {string} experience.form.required - form data - multipart/form-data
   * @param {string} skills.form.required - form data - multipart/form-data
   * @param {string} education.form.required - form data - multipart/form-data
   * @param {string} language.form.required - form data - multipart/form-data
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async updateCV(req: Request, res: Response) {
    const updateForm: cvForm = {
      ...req.body,
    };

    const { id } = req.params;

    const cvService = new CVServiceImpl();

    const schema = Joi.object()
      .keys({
        name: Joi.string().required().messages({
          "any.required": "Name cannot be empty",
        }),
        position: Joi.string().required().messages({
          "any.required": "Position cannot be empty",
        }),
        contact: Joi.string().required().messages({
          "any.required": "Contact cannot be empty",
        }),
        skills: Joi.string().required().messages({
          "any.required": "Skills cannot be empty",
        }),
        education: Joi.string().required().messages({
          "any.required": "Education cannot be empty",
        }),
        language: Joi.string().min(2).required().messages({
          "string.min": "Language must be atleast 2 characters",
          "any.required": "Language cannot be empty",
        }),
      })
      .unknown(true);

    const { error, value } = schema.validate(updateForm);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join("."),
        error: true,
      });
    } else {
      const [success, error] = await cvService.updateCV(updateForm, Number(id));
      if (error.error) {
        return res.status(error.status).json(error);
      } else {
        return res.status(success.status).json(success);
      }
    }
  }

  /**
   * DELETE /v1/delete-cv/{id}
   * @summary Delete CV
   * @tags CV
   * @param {number} id.path - id
   * @security BasicAuth | BearerAuth
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async deleteCV(req: Request, res: Response) {
    const { id } = req.params;

    const cvService = new CVServiceImpl();

    const [success, error] = await cvService.deleteCV(Number(id));

    if (error.error) {
      return res.status(error.status).json(error);
    } else {
      return res.status(success.status).json(success);
    }
  }
}
