"use server";

import { connectmongodb } from "@/lib/connect";
import User from "@/mongodb/authschema";
import bcrypt from "bcrypt";
import * as jose from "jose";
type authtype = {
  username: string;
  password: string;
  phone: string;
  email: string;
  address: string;
  fistname: string;
  lastname: string;
};

export const register = async (
  Data: authtype,
): Promise<{ message: string }> => {
  connectmongodb();

  const existingUser = await User.findOne({ username: Data.username });
  if (existingUser) {
    return {
      message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว",
    };
  }

  const existingEmail = await User.findOne({ email: Data.email });
  if (existingEmail) {
    return {
      message: "อีเมลนี้มีอยู่ในระบบแล้ว",
    };
  }
  const hashpassword = await bcrypt.hash(Data.password, 10);
  const format = new User({
    username: Data.username,
    password: hashpassword,
    email: Data.email,
    phonenumber: Data.phone,
    address: Data.address,
    firstname: Data.fistname,
    lastname: Data.lastname,
  });

  const response = await format.save();

  if (!response) {
    return {
      message: "fail to Registered plase try again later ",
    };
  }
  return { message: "Registered successfully" };
};

type logintype = {
  username: string;
  password: string;
};
export const login = async (
  Data: logintype,
): Promise<{ message: string; token: string }> => {
  connectmongodb();
  const findoneuser = await User.findOne({ username: Data.username });

  if (!findoneuser || !findoneuser.password) {
    return {
      message: "User not found",
      token: "",
    };
  }

  const compare = await bcrypt.compare(Data.password, findoneuser.password);
  if (!compare) {
    return {
      message: "Invalid password",
      token: "",
    };
  }

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret",
  );

  const token = await new jose.SignJWT({
    id: findoneuser._id,
    username: findoneuser.username,
    role: findoneuser.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return {
    message: "Login successfully",
    token,
  };
};

type CheckTokenResponse = {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  status?: boolean;
};

export const checktoken = async (
  token: string,
): Promise<CheckTokenResponse> => {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret",
  );

  const { payload } = await jose.jwtVerify(token, secret);

  // cast payload ให้เป็น type ของเราเอง
  const data = payload as unknown as CheckTokenResponse;

  if (!data.id || !data.username) {
    return {
      id: "",
      username: "",
      role: "",
      exp: 0,
      iat: 0,
      status: false,
    };
  }

  return {
    id: data.id,
    username: data.username,
    role: data.role,
    exp: data.exp,
    iat: data.iat,
    status: true,
  };
};
