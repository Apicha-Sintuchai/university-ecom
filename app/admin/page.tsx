/** eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getorder } from "../action/order.action";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
type OrderItem = {
  productname: string;
  price: number;
  _id: string;
};

type UserRef = {
  _id: string;
  username: string;
  password: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  address: string;
  role: string;
  credit: number;
  __v: number;
};

type Order = {
  _id: string;
  order: OrderItem[];
  totalprice: number;
  status: boolean;
  userref: UserRef;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type DataFromServer = {
  data: Order[];
  status: boolean;
  message: string;
};

export default function Page() {
  const [data, setData] = useState<DataFromServer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchServer = async () => {
      try {
        setLoading(true);
        const response = await getorder(token);
        console.log(response);

        if (!response.message) {
          localStorage.removeItem("token");
          router.push("/");
        }
        setData(response);
      } catch (err: any) {
        if (err.name === "JWTExpired" || err.message?.includes("expired")) {
          setError("Session หมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServer();
  }, [router]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">กำลังโหลดข้อมูล...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>รายการคำสั่งซื้อ</CardTitle>
          <CardDescription>{data?.data?.length || 0} รายการ</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.status && data.data.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่สั่ง</TableHead>
                    <TableHead>ชื่อ-นามสกุล</TableHead>
                    <TableHead>สินค้า</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>ที่อยู่</TableHead>
                    <TableHead>เบอร์โทร</TableHead>
                    <TableHead>อีเมล</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {order.userref.firstname} {order.userref.lastname}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.order.map((item) => (
                            <div key={item._id}>{item.productname}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        ฿{order.totalprice.toFixed(2)}
                      </TableCell>
                      <TableCell>{order.userref.address}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {order.userref.phonenumber}
                      </TableCell>
                      <TableCell>{order.userref.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              ไม่มีรายการคำสั่งซื้อ
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
