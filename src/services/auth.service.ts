import {
  ResponseModelOnlyMessage,
  ResponseWhenError,
  ResponseModelWithToken,
  ResponseModelWithData,
} from "../constant/response_model";
import { prisma } from "../database/database";
import { signInForm, signUpForm } from "../dto/auth.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthServiceImpl {
  public async signUp(
    signUpForm: signUpForm,
    hash: string
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      const checkExistingUsers = await prisma.users.findUnique({
        where: {
          username: signUpForm.username,
        }
      })

      if(checkExistingUsers){
        responseWhenError = {
          status: 400,
          message: "Username Already Exist",
          error: true
        }
      } else {
        await prisma.users
        .create({
          data: {
            username: signUpForm.username,
            name: signUpForm.name,
            password: hash,
          },
        })
        .then(() => {
          responseModelOnlyMessage = {
            status: 201,
            message: "Successfully Create Account",
            error: false,
          };
        })
        .catch((err) => {
          responseWhenError = {
            status: 400,
            message: `${err}`,
            error: true,
          }
        })
      }
    } catch (err) {
      responseWhenError = {
        status: 500,
        error: true,
        message: `Something Went Wrong`,
      };
    }
    
    return [responseModelOnlyMessage, responseWhenError];
  }

  public async signIn(
    signInForm: signInForm
  ): Promise<
    [ResponseModelWithToken, ResponseWhenError]
  > {
    let responseModelWithToken = {} as ResponseModelWithToken;
    let responseModelWhenError = {} as ResponseWhenError;

    try {
      let checkExistingUsers = await prisma.users.findFirst({
        where: {
          username: signInForm.username
        }
      })

      if(checkExistingUsers === null) {
        responseModelWhenError = {
          status: 404,
          message: "User Not Found",
          error: true,
        }
      } else {
        const resultBcrypt = bcrypt.compareSync(
          signInForm.password,
          checkExistingUsers.password
        );
        if(resultBcrypt) {
          const token = jwt.sign(
            {
              data: {
                id: checkExistingUsers.id,
                username: checkExistingUsers.username,
                name: checkExistingUsers.name,
                password: checkExistingUsers.password,
              },
            },
            `${process.env.JWT_TOKEN_SECRET}`,
            { expiresIn: "1 day" }
          );
          responseModelWithToken = {
            status: 200,
            token: token,
            message: "Successfully Sign In",
            error: false,
          }
        } else {
          responseModelWhenError = {
            status: 400,
            message: "Username or Password is incorrect",
            error: true,
          }
        }
      }
    } catch (error) {
      responseModelWhenError = {
        status: 400,
        message: `Something went wrong -> ${error}`,
        error: true,
      }
    }

    return [ responseModelWithToken, responseModelWhenError ];
  }


  public async tokenCheck(token: string): Promise<[
    ResponseModelWithData, ResponseWhenError
  ]> {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseModelWhenError = {} as ResponseWhenError;

    jwt.verify(token, 'secret', function( err, dataJWT ) {
      if(err) {
        if(err.name == 'TokenExpiredError') {
          responseModelWhenError = {
            status: 401,
            message: "Token has Expired",
            error: true
          }
        }
      } else {
        responseModelWithData = {
          status: 200,
          data: dataJWT,
          message: "Successfully get User",
          error: false,
        }
      }
    })

    return [responseModelWithData, responseModelWhenError]
  }


  public async deleteUser(
    id: number
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      await prisma.users
        .delete({
          where: {
            id: Number(id),
          },
        })
        .then((data) => {
          responseModelOnlyMessage = {
            status: 200,
            message: "Succesfully Delete Account",
            error: false,
          };
        })
        .catch((err) => {
          responseWhenError = {
            status: 400,
            message: `Failed to Delete Account Because ${err}`,
            error: true,
          };
        });
    } catch (err) {
      responseWhenError = {
        status: 400,
        message: "Something Went Wrong",
        error: true,
      };
    }

    return [responseModelOnlyMessage, responseWhenError];
  }
}
