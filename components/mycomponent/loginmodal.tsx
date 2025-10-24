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
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/app/action/auth.action";

type loginmodeltype = {
  showloginmodal: boolean;
  setshowloginmodel: (value: boolean) => void;
};

type authtype = {
  username: string;
  password: string;
};

export const LoginModel = ({
  showloginmodal,
  setshowloginmodel,
}: loginmodeltype) => {
  const [formdata, setformdata] = useState<authtype>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form data:", formdata);
    const response = await login(formdata);
    localStorage.setItem("token", response.token);
    toast(response.message);

    setInterval(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Dialog open={showloginmodal} onOpenChange={setshowloginmodel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เข้าสู่ระบบ</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={formdata.username}
                onChange={(e) => {
                  setformdata({ ...formdata, username: e.target.value });
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
            <Button type="submit">เข้าสู่ระบบ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
