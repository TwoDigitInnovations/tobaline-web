"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Api } from "../../services/service";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { userContext } from "./_app";
import Head from "next/head";

const SignUp = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [user] = useContext(userContext);

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [eyeIcon, setEyeIcon] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (!/^[A-Za-z ]+$/.test(value)) return "Only letters allowed";
        if (value.length < 2) return "Minimum 2 characters required";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Minimum 8 characters required";
        if (!/[A-Z]/.test(value)) return "One uppercase letter required";
        if (!/[a-z]/.test(value)) return "One lowercase letter required";
        if (!/[0-9]/.test(value)) return "One number required";
        if (!/[^A-Za-z0-9]/.test(value))
          return "One special character required";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && /[0-9]/.test(value)) return;

    setUserDetail({ ...userDetail, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const submitSignUp = (e) => {
    e.preventDefault();

    // let formValid = true;
    // const newErrors = {};

    // Object.keys(userDetail).forEach((key) => {
    //   const error = validateField(key, userDetail[key]);
    //   if (error) {
    //     formValid = false;
    //     newErrors[key] = error;
    //   }
    // });

    // setErrors(newErrors);

    // if (!formValid) {
    //   props?.toaster?.({
    //     type: "error",
    //     message: "Please fix the errors in the form",
    //   });
    //   return;
    // }

    props?.loader?.(true);

    const data = {
      email: userDetail.email.toLowerCase(),
      name: userDetail.name,
      password: userDetail.password,
      type: "USER",
    };

    Api("post", "auth/register", data, router).then(
      (res) => {
        props?.loader?.(false);
        props?.toaster?.({
          type: "success",
          message: "Registered successfully",
        });
        router.push("/login");
      },
      (err) => {
        props?.loader?.(false);
        props?.toaster?.({
          type: "error",
          message: err?.message || "Something went wrong",
        });
      },
    );
  };

  return (
    <>
      <Head>
        <title>Shop Everyday Essentials at Tobaline Today</title>
        <meta
          name="description"
          content="Tobaline offers top-quality Clothes!"
        />
        <link rel="canonical" href="" />
      </Head>

      <div className="md:min-h-screen min-h-[700px] flex max-w-7xl mx-auto">
        <div className="w-full lg:w-1/2 flex md:p-0 p-8 items-center justify-center bg-white">
          <form onSubmit={submitSignUp} className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("Get Started Now")}
              </h1>
              <p className="text-gray-600 text-sm">
                {t("Enter your Credentials to Create your account")}
              </p>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-md font-medium text-gray-900 mb-1">
                  {t("Name")}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t("Enter your Name")}
                  value={userDetail.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-md font-medium text-gray-900 mb-1">
                  {t("Email")}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t("Enter your email")}
                  value={userDetail.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-md font-medium text-gray-900 mb-1">
                  {t("Password")}
                </label>
                <div className="relative">
                  <input
                    type={eyeIcon ? "text" : "password"}
                    name="password"
                    placeholder={t("Enter your password")}
                    value={userDetail.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setEyeIcon(!eyeIcon)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 cursor-pointer"
                  >
                    {eyeIcon ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800"
              >
                {t("Signup")}
              </button>
            </div>

            <div className="mt-6 text-center flex  justify-center items-center gap-2">
              <p className="text-sm text-gray-600 ">{t("Have an account?")} </p>
              <span
                className="block font-semibold cursor-pointer text-gray-900 hover:underline"
                onClick={() => router.push("/login")}
              >
                {" "}
                {t("Sign In")}{" "}
              </span>
            </div>
          </form>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative ">
          <div className="absolute inset-0 flex items-center justify-center pb-8">
            <div className="relative w-full h-full max-w-2xl">
              <img
                src="/images/loginimage.png"
                alt="Nature art"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
