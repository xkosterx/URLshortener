import {AuthUserResType} from "../routes/auth.routes";

const jwt = require("jsonwebtoken");
const config = require("config");
import { Request, Response, NextFunction } from 'express';

export type AuthReqBody = {
  user: AuthUserResType
}
module.exports = (req:AuthReqBody & Request, res:Response, next:NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token:string = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
