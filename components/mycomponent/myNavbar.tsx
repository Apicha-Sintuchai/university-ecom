"use client";
import { useEffect, useState } from "react";
import { checktoken } from "@/app/action/auth.action";
import { Button } from "../ui/button";
import { LoginModel } from "./loginmodal";
import { RegisterModel } from "./registermodel";
import { CartModal } from "./cartmodal";

type CheckTokenResponse = {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  status?: boolean;
};

export default function MyNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showloginmodal, setshowloginmodal] = useState<boolean>(false);
  const [showregistermodal, setshowregistermodal] = useState<boolean>(false);
  const [userData, setUserData] = useState<CheckTokenResponse | null>(null);
  const [showcartmodal, setshowcartmodal] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setTimeout(() => {
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      checktoken(token)
        .then((item) => {
          setIsLoggedIn(true);
          setUserData(item);
        })
        .catch(() => setIsLoggedIn(false));
    }, 0);
  }, []);

  if (isLoggedIn === null) {
    return (
      <nav className="flex justify-end items-center p-4">
        <span className="text-gray-400">Loading...</span>
      </nav>
    );
  }

  return (
    <>
      <nav className="flex justify-end items-center p-4 gap-3">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {userData && (
              <span className="text-gray-700 font-medium">
                สวัสดี, {userData.username}
              </span>
            )}
            <Button
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setshowcartmodal(true)}
            >
              <span className="mr-2">🛒</span>
              ตะกร้า
            </Button>

            <Button
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex justify-end items-center gap-4">
            <Button
              onClick={() => setshowregistermodal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              📝 Register
            </Button>
            <Button
              onClick={() => setshowloginmodal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔐 Login
            </Button>
          </div>
        )}
      </nav>

      {/* Modals - วางไว้นอก nav เพื่อให้ทำงานได้ทุกสถานะ */}
      <LoginModel
        showloginmodal={showloginmodal}
        setshowloginmodel={setshowloginmodal}
      />
      <RegisterModel
        showloginmodal={showregistermodal}
        setshowloginmodel={setshowregistermodal}
      />
      <CartModal
        showCartmodal={showcartmodal}
        setshowCartmodel={setshowcartmodal}
      />
    </>
  );
}
