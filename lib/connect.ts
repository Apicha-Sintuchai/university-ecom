import mongoose from "mongoose";

export const connectmongodb = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.mongodb}`);

    if (!connect) {
      throw new Error(connect);
    }
  } catch (err) {
    console.log(err);
  }
};
