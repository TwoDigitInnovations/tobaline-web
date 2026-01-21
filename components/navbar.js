import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import {
  Search,
  X,
  Heart,
  ShoppingCart,
  CircleUserRound,
  User2,
  User,
} from "lucide-react";
import {
  cartContext,
  openCartContext,
  userContext,
  favoriteProductContext,
} from "../src/pages/_app";
import Swal from "sweetalert2";
import { IoIosArrowForward } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { languageContext } from "../src/pages/_app";
import Image from "next/image";

const Navbar = (props) => {
  const router = useRouter();
  const [showHover, setShowHover] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [searchData, setSearchData] = useState("");
  const [CartTotal, setCartTotal] = useState(0);
  const [openCart, setOpenCart] = useContext(openCartContext);
  const [CartItem, setCartItem] = useState(0);
  const [cartData, setCartData] = useContext(cartContext);
  const [Favorite, setFavorite] = useContext(favoriteProductContext);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [mainTotal, setMainTotal] = useState(0);
  const [productList, SetProductList] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [pickupOption, setPickupOption] = useState("orderPickup");
  const [openModel, setOpenModel] = useState(false);
  const [baseCartTotal, setBaseCartTotal] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [deliverytip, setdeliverytip] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState(0);
  const [isOnce, setIsOnce] = useState(false);
  const { lang, changeLang } = useContext(languageContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const isLoggedIn = user?._id || user?.token;
  const [pincodes, setPincodes] = useState([]);
  const [date, setDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (language) => {
    try {
      changeLang(language);
      i18n.changeLanguage(language);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <>
      <header className="md:shadow-none shadow-md bg-white w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between md:px-0 px-4 py-2">
       
          <div className="relative md:w-24 w-40 h-16 flex items-start cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/images/logo.png"
              alt="bachhoustan logo"
              fill
              className="object-contain cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

      
          <nav className="hidden md:flex items-center gap-10 font-serif text-lg text-stone-700">
            <span
              className="cursor-pointer hover:text-black transition"
              onClick={() => router.push("/")}
            >
              Home
            </span>
            <span
              className="cursor-pointer hover:text-black transition"
              onClick={() => router.push("/collection")}
            >
              Collection
            </span>
            <span
              className="cursor-pointer hover:text-black transition"
              onClick={() => router.push("/sustainability")}
            >
              Sustainability
            </span>
            <span
              className="cursor-pointer hover:text-black transition"
              onClick={() => router.push("/shop")}
            >
              Shop
            </span>
            <span
              className="cursor-pointer hover:text-black transition"
              onClick={() => router.push("/about")}
            >
              About
            </span>
          </nav>

       
          <div className="hidden md:flex items-center gap-4">
            <Search className="cursor-pointer text-black" size={28} />
            {user?.token === undefined ? (
              <User
                className="cursor-pointer text-black"
                size={28}
                onClick={() => router.push("/login")}
              />
            ) : (
              <div
                className="relative group cursor-pointer"
                onClick={() => setShowHover(!showHover)}
              >
                <div className="w-10 h-10 bg-custom-green rounded-full flex items-center justify-center">
                  <p className="text-white font-bold text-base">
                    {user?.username?.charAt(0).toUpperCase() || "T"}
                  </p>
                </div>

                {showHover && (
                  <div className="absolute right-0 top-12 bg-custom-green text-white rounded-lg shadow-lg w-56 py-2">
                    <ul className="divide-y divide-white/20">
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setShowHover(false);
                          router.push("/Mybooking");
                        }}
                      >
                        {t("My Order")}
                        <IoIosArrowForward className="text-xl" />
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setShowHover(false);
                          router.push("/Myhistory");
                        }}
                      >
                        {t("History")}
                        <IoIosArrowForward className="text-xl" />
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setShowHover(false);
                          router.push("/editProfile");
                        }}
                      >
                        {t("Edit Profile")}
                        <IoIosArrowForward className="text-xl" />
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          Swal.fire({
                            text: t("Are you sure you want to logout?"),
                            showCancelButton: true,
                            confirmButtonText: t("Yes"),
                            cancelButtonText: t("No"),
                            confirmButtonColor: "#2e7d32",
                            cancelButtonColor: "#2e7d32",
                            customClass: {
                              confirmButton: "px-12 rounded-xl",
                              cancelButton:
                                "px-12 py-2 rounded-lg text-white border-[12px] border-custom-green",
                            },
                            buttonsStyling: true,
                            reverseButtons: true,
                            width: "320px",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setUser({});
                              setShowHover(false);
                              localStorage.removeItem("userDetail");
                              localStorage.removeItem("token");
                              router.push("/signIn");
                            }
                          });
                        }}
                      >
                        {t("Sign out")}
                        <IoIosArrowForward className="text-xl" />
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/Cart")}
            >
              <ShoppingCart size={26} className="text-black"/>
              {cartData.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-custom-green text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {cartlenth}
                </span>
              )}
            </div>
          </div>

          <div className="md:hidden flex justify-end items-center gap-1">
            <select
              className="bg-white border border-gray-300 text-sm px-1 py-2 rounded-md text-gray-700 focus:outline-none"
              value={lang}
              onChange={(e) => handleClick(e.target.value)}
            >
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>

            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/Favourite")}
            >
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
