"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Api } from "../../services/service";
import { userContext } from "./_app";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Head from "next/head";

const Login = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);
  const [eyeIcon, setEyeIcon] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    if (!userDetail.email) {
      props.toaster({ type: "error", message: "Please enter your email" });
      return;
    }
    if (!userDetail.password) {
      props.toaster({ type: "error", message: "Please enter your password" });
      return;
    }
    const data = {
      email: userDetail.email.toLowerCase(),
      password: userDetail.password,
    };

    props.loader(true);
    console.log(data);

    Api("post", "auth/login", data, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          const userData = res.data;
          router.push("/");
          localStorage.setItem("userDetail", JSON.stringify(userData.user));
          localStorage.setItem("token", userData.token);
          setUser(userData.user);
          setUserDetail({ email: "", password: "" });
          props.toaster({
            type: "success",
            message: "You are successfully logged in",
          });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.data?.message || err?.message,
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
        <div className="w-full lg:w-1/2 flex items-center md:p-0 p-8 justify-center bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("Welcome back!")}
              </h1>
              <p className="text-gray-600 text-sm">
                {t("Enter your Credentials to access your account")}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-md font-medium text-gray-900 mb-1">
                  {t("Email")}
                </label>
                <input
                  type="email"
                  placeholder={t("Enter your email")}
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-md font-medium text-gray-900">
                    {t("Password")}
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push("/forgotpasword")}
                    className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer hover:underline"
                  >
                    {t("Forgot password")}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={eyeIcon ? "text" : "password"}
                    placeholder={t("Enter your password")}
                    value={userDetail.password}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setEyeIcon(!eyeIcon)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {eyeIcon ? (
                      <IoEyeOutline size={20} />
                    ) : (
                      <IoEyeOffOutline size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={submit}
                className="w-full mt-6 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {t("Login")}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("Don't have an account?")}{" "}
                <button
                  className="font-semibold cursor-pointer text-gray-900 hover:underline"
                  onClick={() => router.push("/singup")}
                >
                  {t("Sign Up")}
                </button>
              </p>
            </div>
          </div>
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

export default Login;
