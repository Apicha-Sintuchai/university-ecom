import mongoose from "mongoose";

export const connectmongodb = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb://root:example@localhost:27017/project?authSource=admin",
    );

    if (!connect) {
      throw new Error(connect);
    }
  } catch (err) {
    console.log(err);
  }
};
