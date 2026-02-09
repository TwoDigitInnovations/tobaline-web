import React, { useContext } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { IoHomeOutline } from "react-icons/io5";
import { FaFirstOrder } from "react-icons/fa6";
import { useRouter } from "next/router";
import { cartContext, openCartContext } from "../src/pages/_app";
import { useTranslation } from "react-i18next";
import { LayoutList, ListOrdered } from "lucide-react";

function MobileFooter() {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation();
  const [cartData] = useContext(cartContext);

  const menuItems = [
    {
      label: t("Home"),
      icon: IoHomeOutline,
      path: "/",
    },
    {
      label: t("Collection"),
      icon: LayoutList,
      path: "/Collection?category=All",
    },
    {
      label: t("Orders"),
      icon: ListOrdered,
      path: "/MyOrder",
    },
    {
      label: t("Cart"),
      icon: FiShoppingCart,
      path: "/Cart",
      isCart: true,
    },
    {
      label: t("Account"),
      icon: CgProfile,
      path: "/account",
    },
  ];

  return (
    <div className="bg-black w-full grid grid-cols-5 ">
      {menuItems.map((item, idx) => {
        const isActive = router.pathname === item.path.split("?")[0];

        console.log(isActive);
        console.log(currentPath);

        return (
          <div key={idx} className="flex justify-center items-center ">
            <div
              key={idx}
              className={`flex flex-col justify-center items-center transition 
              ${isActive ? "bg-white relative text-black rounded-full w-10 h-10 m-2 p-2`" : "m-1 p-1 text-white w-10 h-10"}`}
              onClick={() => {
                router.push(item.path);
              }}
            >
              <item.icon
                className={`w-[20px] h-[20px] ${
                  isActive ? "text-black" : "text-white"
                }`}
              />

              {item.label === t("Cart") && cartData.length > 0 && (
                <div className="absolute text-md text-black rounded-full  flex items-center justify-center text-[9px] top-1 right-4">
                  {cartData.length}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MobileFooter;
