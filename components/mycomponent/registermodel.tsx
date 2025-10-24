import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { register } from "@/app/action/auth.action";
import { toast } from "sonner";

type registermodeltype = {
  showloginmodal: boolean;
  setshowloginmodel: (value: boolean) => void;
};

type authtype = {
  username: string;
  password: string;
  phone: string;
  email: string;
  address: string;
  fistname: string;
  lastname: string;
};

export const RegisterModel = ({
  showloginmodal,
  setshowloginmodel,
}: registermodeltype) => {
  const [formdata, setformdata] = useState<authtype>({
    username: "",
    password: "",
    phone: "",
    email: "",
    address: "",
    fistname: "",
    lastname: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formdata);
    const response = await register(formdata);
    toast(response.message);

    // window.location.reload();
  };

  return (
    <Dialog open={showloginmodal} onOpenChange={setshowloginmodel}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>สมัครสมาชิก</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อสมัครสมาชิก</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">ชื้อ</Label>
              <Input
                id="firtname"
                name="firtname"
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={formdata.fistname}
                onChange={(e) => {
                  setformdata({ ...formdata, fistname: e.target.value });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">นามสกุล</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={formdata.lastname}
                onChange={(e) => {
                  setformdata({ ...formdata, lastname: e.target.value });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={formdata.username}
                onChange={(e) => {
                  setformdata({ ...formdata, username: e.target.value });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formdata.email}
                onChange={(e) => {
                  setformdata({ ...formdata, email: e.target.value });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0812345678"
                value={formdata.phone}
                onChange={(e) => {
                  setformdata({ ...formdata, phone: e.target.value });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">ที่อยู่</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="ที่อยู่ของคุณ"
                value={formdata.address}
                onChange={(e) => {
                  setformdata({ ...formdata, address: e.target.value });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formdata.password}
                onChange={(e) => {
                  setformdata({ ...formdata, password: e.target.value });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button type="submit">สมัครสมาชิก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
