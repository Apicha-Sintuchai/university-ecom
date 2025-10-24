"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { shopitemobject } from "@/lib/object";
import { useCart } from "@/zustand/usecard";

export default function Home() {
  const [shopitem] = useState(shopitemobject);

  const { addToCart, cart } = useCart();

  console.log(cart);
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
          สินค้าแนะนำ
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopitem.map((value, index) => (
            <Card
              key={index}
              className="overflow-hidden border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="bg-gradient-to-br from-red-50 to-white p-6">
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={value.iamge}
                    alt={value.name || "สินค้า"}
                    fill
                    className="rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                      สินค้าแนะนำ
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      ฿{value.price || "199"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {value.name || "เส้นตีนแดกได้ไม่จำกัด"}
                  </h2>
                </div>

                <div className="space-y-2 pt-4 border-t border-red-100">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-red-500">📋</span>
                    รายละเอียดสินค้า
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description ||
                      "เส้นตีนแดกได้ไม่จำกัด คุณภาพพรีเมียม สดใหม่ทุกวัน พร้อมเสิร์ฟความอร่อย"}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    const selcetitemtocard = {
                      id: value.id,
                      productname: value.name,
                      price: value.price,
                    };

                    addToCart(selcetitemtocard);
                  }}
                >
                  <span className="mr-2">🛒</span>
                  เพิ่มเข้าตะกร้า
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
