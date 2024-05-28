require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/User";

interface ITokenOptions {
  expires: Date;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}


// options for cookies
 export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();

  // Only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
