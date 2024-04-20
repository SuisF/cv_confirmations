import {
  ResponseModelWithData,
  ResponseModelOnlyMessage,
  ResponseWhenError,
} from "../constant/response_model";
import { cvForm } from "../dto/cv.dto";
import { prisma } from "../database/database";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class CVServiceImpl {
  public async createCV(
    cvForm: cvForm
    //token: String
  ): Promise<[ResponseModelWithData, ResponseWhenError]> {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseWhenError = {} as ResponseWhenError;

    try {
      // jwt.verify(
      //   token as string,
      //   'secret',
      //   async function (err: any, decode: any) {
      //     if (err) {
      //       responseWhenError = {
      //         status: 400,
      //         message: `Token is Invalid -> ${err}`,
      //         error: true,
      //       };
      //    } else {
      await prisma.cv
        .create({
          data: {
            name: cvForm.name,
            position: cvForm.position,
            profile_pict: cvForm.profile_pict,
            about_me: cvForm.about_me,
            contact: cvForm.contact,
            experience: cvForm.experience,
            skills: cvForm.skills,
            education: cvForm.education,
            language: cvForm.language,
            createdAt: new Date(),
          },
        })
        .then((data) => {
          responseModelWithData = {
            status: 201,
            data: data,
            message: "Successfully Create CV",
            error: false,
          };
        })
        .catch((error) => {
          responseWhenError = {
            status: 400,
            message: `${error}`,
            error: true,
          };
        });
      //}
      // }
      // );
    } catch (err) {
      responseWhenError = {
        status: 500,
        message: `Something Went Wrong -> ${err}`,
        error: true,
      };
    }

    return [responseModelWithData, responseWhenError];
  }

  public async getCV(
    // token: String
  ): Promise<[ResponseModelWithData, ResponseWhenError]> {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseWhenError = {} as ResponseWhenError;

    try {
      // jwt.verify(
      //   token as string,
      //   `${process.env.JWT_TOKEN_SECRET}`,
      //   async function (err: any, decode: any) {
      //     if (err) {
      //       responseWhenError = {
      //         status: 400,
      //         message: `Token is Invalid -> ${err}`,
      //         error: true,
      //       };
      //     } else {
            await prisma.cv
              .findMany({
                orderBy: [
                  {
                    id: "desc",
                  },
                ],
              })
              .then((data) => {
                responseModelWithData = {
                  status: 200,
                  data: data,
                  message: "Successfully Get All CV Datas",
                  error: false,
                };
              })
              .catch((error) => {
                responseWhenError = {
                  status: 400,
                  message: `${error}`,
                  error: true,
                };
              });
      //     }
      //   }
      // );
    } catch (error) {
      responseWhenError = {
        status: 500,
        message: `Something Went Wrong -> ${error}`,
        error: true,
      };
    }

    return [responseModelWithData, responseWhenError];
  }

  public async updateCV(
    updateForm: cvForm,
    id: number
  ): Promise<[ResponseModelWithData, ResponseWhenError]> {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseModelWhenError = {} as ResponseWhenError;

    try {
      await prisma.cv
        .update({
          where: {
            id: Number(id),
          },
          data: {
            name: updateForm.name,
            position: updateForm.position,
            profile_pict: updateForm.profile_pict,
            about_me: updateForm.about_me,
            contact: updateForm.contact,
            experience: updateForm.experience,
            skills: updateForm.skills,
            education: updateForm.education,
            language: updateForm.language,
            updatedAt: new Date(),
          },
        })
        .then((data) => {
          responseModelWithData = {
            status: 200,
            data: data,
            message: `Successfully Update This Data With ID: ${id}`,
            error: false,
          };
        })
        .catch((error) => {
          responseModelWhenError = {
            status: 400,
            message: `${error}`,
            error: true,
          };
        });
    } catch (error) {
      responseModelWhenError = {
        status: 500,
        message: "Something Went Wrong",
        error: true,
      };
    }

    return [responseModelWithData, responseModelWhenError];
  }

  public async deleteCV(
    id: Number
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseModelWhenError = {} as ResponseWhenError;

    try {
      await prisma.cv
        .delete({
          where: {
            id: Number(id),
          },
        })
        .then(() => {
          responseModelOnlyMessage = {
            status: 200,
            message: `Successfully Delete This Data With ID: ${id}`,
            error: false,
          };
        })
        .catch((error) => {
          responseModelWhenError = {
            status: 400,
            message: `${error}`,
            error: true,
          };
        });
    } catch (error) {
      responseModelWhenError = {
        status: 500,
        message: "Something Went Wrong",
        error: true,
      };
    }

    return [responseModelOnlyMessage, responseModelWhenError];
  }
}
