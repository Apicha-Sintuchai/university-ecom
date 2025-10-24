"use server";

import Order from "@/mongodb/orderschema";
import { checktoken } from "./auth.action";
import { connectmongodb } from "@/lib/connect";
import User from "@/mongodb/authschema";

type ordertype = {
  order: Array<{
    productname: string;
    price: number;
  }>;
  token: string;
  base64image: string;
};

type slipresponse = {
  status: number;
  data: {
    payload: string;
    transRef: string;
    date: string;
    countryCode: string;
    amount: {
      amount: number;
      local: {
        amount?: number;
        currency?: string;
      };
    };
    fee?: number;
    ref1?: string;
    ref2?: string;
    ref3?: string;
    sender: {
      bank: {
        id?: string;
        name?: string;
        short?: string;
      };
      account: {
        name: {
          th?: string;
          en?: string;
        };
        bank?: {
          type: "BANKAC" | "TOKEN" | "DUMMY";
          account: string;
        };
        proxy?: {
          type: "NATID" | "MSISDN" | "EWALLETID" | "EMAIL" | "BILLERID";
          account: string;
        };
      };
    };
    receiver: {
      bank: {
        id: string;
        name?: string;
        short?: string;
      };
      account: {
        name: {
          th?: string;
          en?: string;
        };
        bank?: {
          type: "BANKAC" | "TOKEN" | "DUMMY";
          account: string;
        };
        proxy?: {
          type: "NATID" | "MSISDN" | "EWALLETID" | "EMAIL" | "BILLERID";
          account: string;
        };
      };
      merchantId?: string;
    };
  };
};

export const createorder = async (Data: ordertype) => {
  await connectmongodb();

  const userData = await checktoken(Data.token);
  const findoneuser = await User.findOne({ username: userData.username });

  if (!userData.status || !findoneuser) {
    return {
      success: false,
      message: "Invalid or expired token",
    };
  }

  const totalprice = Data.order.reduce((sum, item) => sum + item.price, 0);

  const toeasyslip = await fetch(
    "https://developer.easyslip.com/api/v1/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer f4f3d467-fbca-4525-80f2-dc1ad5d4ed97",
      },
      body: JSON.stringify({
        image: Data.base64image,
      }),
    },
  );

  const result: slipresponse = await toeasyslip.json();
  console.log(result);

  if (totalprice !== result.data.amount.amount) {
    return {
      message: "สลิปไม่ถูกต้อง",
      status: false,
    };
  }

  await Order.create({
    order: Data.order,
    totalprice: totalprice,
    status: false,
    userref: findoneuser._id,
  });

  return {
    success: true,
    message: "Order created successfully",
  };
};

export const getorder = async (token: string) => {
  await connectmongodb();

  const userData = await checktoken(token);

  if (!userData) {
    return {
      status: false,
      message: "cant validate token",
      data: [],
    };
  }

  if (userData.role !== "admin") {
    return {
      status: false,
      message: "not role admin",
      data: [],
    };
  }

  const getdata = (await Order.find().populate("userref").lean()).map(
    (order) => ({
      ...order,
      _id: order._id.toString(),
      userref: order.userref
        ? { ...order.userref, _id: order.userref._id.toString() }
        : null,
      order: order.order.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    }),
  );

  return {
    data: getdata,
    status: true,
    message: "get order",
  };
};
