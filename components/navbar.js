import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { Search, ShoppingCart, User } from "lucide-react";
import { cartContext, userContext } from "../src/pages/_app";
import Swal from "sweetalert2";
import { IoIosArrowForward } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { languageContext } from "../src/pages/_app";
import Image from "next/image";
import { Api } from "../services/service";
import { IoChevronForward } from "react-icons/io5";

const Navbar = (props) => {
  const router = useRouter();
  const [showHover, setShowHover] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [cartData, setCartData] = useContext(cartContext);
  const [open, setOpen] = useState(false);
  const { lang, changeLang } = useContext(languageContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [clothTypes, setClothTypes] = useState([]);

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

  const getAllCategories = async () => {
    props.loader(true);
    try {
      const res = await Api("get", "category/getCategories", "", router);
      setCategories(res.data);
    } catch (err) {
      props.toaster({ type: "error", message: err?.message });
    } finally {
      props.loader(false);
    }
  };
  const getAllClothTypes = async () => {
    props.loader(true);
    try {
      const res = await Api("get", "clothtype/list", "", router);
      setClothTypes(res.data);
    } catch (err) {
      props.toaster({ type: "error", message: err?.message });
    } finally {
      props.loader(false);
    }
  };
  useEffect(() => {
    getAllClothTypes();
    getAllCategories();
  }, []);

  return (
    <>
      <header className="md:shadow-none shadow-md bg-white w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between md:px-0 px-4 py-2">
          <div
            className="relative md:w-36 w-28 md:h-16 h-14 flex items-start cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/images/logo.png"
              alt="bachhoustan logo"
              fill
              className="object-contain cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          <nav className="hidden md:flex items-center gap-10 text-stone-700">
            <span
              className="text-[20px]  cursor-pointer hover:text-black transition"
              onClick={() => router.push("/")}
            >
              Home
            </span>
            <div className="relative group">
              <span className="text-[20px] cursor-pointer hover:text-black transition">
                Collection
              </span>

              <div
                className="
      absolute top-full left-0 mt-3 w-[260px]
      bg-white border border-gray-200 shadow-lg z-50
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-200
    "
              >
                <ul>
                  {categories.slice(0, 5).map((cat, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        router.push(`/Collection?category=${cat.name}`)
                      }
                      className={`px-6 py-4 flex items-center justify-between cursor-pointer
  hover:bg-gray-50 transition border-dashed
  ${i !== 0 ? "border-t" : ""}
`}
                    >
                      <span className="text-gray-800">{cat.name}</span>
                      <IoChevronForward className="text-gray-400" />
                    </li>
                  ))}
                  <li
                    onClick={() => router.push(`/Collection?category=All`)}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer
  hover:bg-gray-50 transition border-dashed border-t"
                  >
                    <span className="text-gray-800">ALl Category</span>
                    <IoChevronForward className="text-gray-400" />
                  </li>
                </ul>
              </div>
            </div>

            <span
              className="text-[20px] cursor-pointer hover:text-black transition"
              onClick={() => router.push("/Sustainability")}
            >
              Sustainability
            </span>

            <div className="relative group">
              <span className="text-[20px] cursor-pointer hover:text-black transition">
                Shop
              </span>

              <div
                className="
      absolute top-full left-0 mt-3 w-[260px]
      bg-white border border-gray-200 shadow-lg z-50
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-200
    "
              >
                <ul>
                  {clothTypes.slice(0, 5).map((cat, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        router.push(`/Collection?type=${cat.name}`)
                      }
                      className={`px-6 py-4 flex items-center justify-between cursor-pointer
  hover:bg-gray-50 transition border-dashed
  ${i !== 0 ? "border-t" : ""}
`}
                    >
                      <span className="text-gray-800">{cat.name}</span>
                      <IoChevronForward className="text-gray-400" />
                    </li>
                  ))}
                  <li
                    onClick={() => router.push(`/Collection?type=All`)}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer
  hover:bg-gray-50 transition border-dashed border-t"
                  >
                    <span className="text-gray-800">All Cloth type</span>
                    <IoChevronForward className="text-gray-400" />
                  </li>
                </ul>
              </div>
            </div>
            <span
              className="text-[20px] cursor-pointer hover:text-black transition"
              onClick={() => router.push("/aboutus")}
            >
              About
            </span>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Search className="cursor-pointer text-black" size={28} />
            {user?.id === undefined ? (
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
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <p className="text-white font-bold text-base">
                    {user?.name?.charAt(0).toUpperCase() || "T"}
                  </p>
                </div>

                {showHover && (
                  <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-56 py-2">
                    <ul className="divide-y divide-white/20">
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setShowHover(false);
                          router.push("/MyOrder");
                        }}
                      >
                        {t("My Order")}
                        <IoIosArrowForward className="text-xl" />
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setShowHover(false);
                          router.push("/MyHistory");
                        }}
                      >
                        {t("History")}
                        <IoIosArrowForward className="text-xl" />
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-white/10 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setShowHover(false);
                          router.push("/Editprofile");
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
                            confirmButtonColor: "#000",
                            cancelButtonColor: "#000",
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
                              router.push("/login");
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
              <ShoppingCart size={26} className="text-black" />
              {cartData.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {cartData.length}
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
            ></div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
