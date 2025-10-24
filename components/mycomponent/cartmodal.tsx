import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useCart } from "@/zustand/usecard";
import { Input } from "../ui/input";
import { useState } from "react";
import { createorder } from "@/app/action/order.action";
import { toast } from "sonner";

type CartModalType = {
  showCartmodal: boolean;
  setshowCartmodel: (value: boolean) => void;
};

export const CartModal = ({
  setshowCartmodel,
  showCartmodal,
}: CartModalType) => {
  const { cart } = useCart();
  const [uploadpic, setuploadpic] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);

  // ฟังก์ชันแปลง File เป็น base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onsubmit = async () => {
    if (!uploadpic) {
      alert("กรุณาอัพโหลดสลิปการโอนเงิน");
      return;
    }

    setIsLoading(true);
    try {
      const base64Image = await fileToBase64(uploadpic);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        return;
      }

      const formatdata = {
        order: cart,
        token: token,
        base64image: base64Image,
      };

      const response = await createorder(formatdata);

      if (response.success) {
        toast("สั่งซื้อสำเร็จ!");
        setshowCartmodel(false);
      } else {
        alert(response.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error:", error);
      toast("เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showCartmodal} onOpenChange={setshowCartmodel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ตะกร้าสินค้า</DialogTitle>
          <DialogDescription>
            สินค้าทั้งหมด {cart.length} รายการ
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ไม่มีสินค้าในตะกร้า
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.productname}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ฿{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">พร้อมเพย์:</span>
            <span className="text-2xl font-bold text-primary">0806594215</span>
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-lg font-semibold">อัพโหลดรูปสลิป:</span>
            <Input
              id="slip"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setuploadpic(files[0]);
                }
              }}
            />
            {uploadpic && (
              <p className="text-sm text-green-600">
                ✓ เลือกไฟล์: {uploadpic.name}
              </p>
            )}
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">ราคารวมทั้งหมด:</span>
            <span className="text-2xl font-bold text-primary">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              ปิด
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onsubmit}
            disabled={cart.length === 0 || !uploadpic || isLoading}
          >
            {isLoading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
