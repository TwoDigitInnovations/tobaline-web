"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Api } from "../../services/service";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Head from "next/head";

const forgotPasswordEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const forgotPasswordOtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(4, "OTP must be exactly 4 digits")
    .matches(/^[0-9]{4}$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

const forgotPasswordConfirmPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const initialValueEmail = {
  email: "",
};

const initialValueOtp = {
  otp: "",
};

const initialValueConfirmPassword = {
  password: "",
  confirmPassword: "",
};

function forgotPassword(props) {
  const router = useRouter();
  const [eyeIcon, setEyeIcon] = useState(false);
  const [eyeIcons, setEyeIcons] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState();

  const { values, handleSubmit, handleChange, handleBlur, errors } = useFormik({
    initialValues: showEmail
      ? initialValueEmail
      : showOtp
        ? initialValueOtp
        : initialValueConfirmPassword,
    validationSchema: showEmail
      ? forgotPasswordEmailSchema
      : showOtp
        ? forgotPasswordOtpSchema
        : forgotPasswordConfirmPasswordSchema,
    onSubmit: (value, { resetForm }) => {
      console.log(value);
      if (showEmail) {
        sendOtp(value, resetForm);
      }
      if (showOtp) {
        verifyOtp(value, resetForm);
      }
      if (showPassword) {
        Submit(value, resetForm);
      }
    },
  });

  const sendOtp = (value, resetForm) => {
    const data = {
      email: value.email,
    };

    props.loader(true);
    Api("post", "auth/sendOTP", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setShowEmail(false);
          setShowOtp(true);
          setShowPassword(false);
          setToken(res?.data?.token);
          resetForm();
          toast.success(
            res?.data?.message || "Confirmation code sent successfully!",
          );
        } else {
          console.log(res?.data?.message);
          toast.error(res?.data?.message || "Failed to send confirmation code");
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(
          err?.data?.message || err?.message || "Something went wrong",
        );
      },
    );
  };

  const verifyOtp = (value, resetForm) => {
    const data = {
      otp: value.otp,
      token,
    };

    console.log(data);
    props.loader(true);
    Api("post", "auth/verifyOTP", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setShowEmail(false);
          setShowOtp(false);
          setShowPassword(true);
          setToken(res?.data?.token);
          resetForm();
          toast.success(
            res?.data?.message || "Confirmation code verified successfully!",
          );
        } else {
          console.log(res?.data?.message);
          toast.error(res?.data?.message || "Invalid confirmation code");
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(
          err?.data?.message || err?.message || "Verification failed",
        );
      },
    );
  };

  const Submit = (value, resetForm) => {
    const data = {
      password: value.password,
      token,
    };
    props.loader(true);
    Api("post", "auth/changePassword", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setShowEmail(true);
          setShowOtp(false);
          setShowPassword(false);
          resetForm();
          toast.success(res?.data?.message || "Password changed successfully!");
          router.push("/signIn");
        } else {
          console.log(res?.data?.message);
          toast.error(res?.data?.message || "Failed to change password");
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(
          err?.data?.message || err?.message || "Password change failed",
        );
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
          <div className="p-4 ">
            <div className="w-full  mx-auto">
              {showEmail && (
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password
                </h2>
              )}
              {showOtp && (
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter Confirmation Code
                </h2>
              )}
              {showPassword && (
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter Your New Password
                </h2>
              )}

              <p className="text-gray-600 text-sm mb-4">
                Secure your account in just a few steps
              </p>

              {showEmail && (
                <form className="md:w-md w-[350px] " onSubmit={handleSubmit}>
                  <div className="mb-4 ">
                    <input
                      className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                      placeholder="Email"
                      type="email"
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.email && (
                      <p className="text-[14px] text-red-600 font-normal mt-1">
                        {errors?.email}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <button
                      className="w-full bg-black text-white text-[16px] font-semibold py-3 rounded mb-2 hover:bg-gray-800 transition cursor-pointer"
                      type="submit"
                    >
                      Send Confirmation Code
                    </button>
                    <p className="text-[16px] text-black font-normal mt-4 w-full text-center">
                      Already have an account?{" "}
                      <span
                        className="font-bold text-custom-green cursor-pointer hover:underline"
                        onClick={() => router.push("/signIn")}
                      >
                        Login
                      </span>
                    </p>
                  </div>
                </form>
              )}

              {showOtp && (
                <form className="md:w-md w-[350px] " onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <input
                      className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                      placeholder=" Confirmation Code"
                      type="text"
                      value={values.otp}
                      name="otp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="6"
                    />
                    {errors?.otp && (
                      <p className="text-[14px] text-red-600 font-normal mt-1">
                        {errors?.otp}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <button
                      className="w-full bg-black text-white text-[16px] font-semibold py-3 rounded mb-2  transition cursor-pointer"
                      type="submit"
                    >
                      Verify Account
                    </button>
                    <p className="text-[16px] text-black font-normal mt-4 w-full text-center">
                      Didn’t receive Confirmation Code?{" "}
                      <span
                        className="font-bold text-custom-green cursor-pointer hover:underline"
                        // onClick={() => router.push('/')}
                      >
                        Resend Now
                      </span>
                    </p>
                  </div>
                </form>
              )}

              {/* Step 3: Enter New Password */}
              {showPassword && (
                <form className="md:w-md w-[350px]" onSubmit={handleSubmit}>
                  <div className="mb-4 relative">
                    <input
                      className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                      placeholder="New Password"
                      type={!eyeIcon ? "password" : "text"}
                      value={values.password}
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div
                      className="absolute top-2 right-3 cursor-pointer"
                      onClick={() => setEyeIcon(!eyeIcon)}
                    >
                      {!eyeIcon ? (
                        <IoEyeOffOutline className="w-[20px] h-[20px] text-gray-700" />
                      ) : (
                        <IoEyeOutline className="w-[20px] h-[20px] text-gray-700" />
                      )}
                    </div>
                    {errors?.password && (
                      <p className="text-[14px] text-red-600 font-normal mt-1">
                        {errors?.password}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 relative">
                    <input
                      className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                      placeholder="Confirm Password"
                      type={!eyeIcons ? "password" : "text"}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div
                      className="absolute top-2 right-3 cursor-pointer"
                      onClick={() => setEyeIcons(!eyeIcons)}
                    >
                      {!eyeIcons ? (
                        <IoEyeOffOutline className="w-[20px] h-[20px] text-gray-700" />
                      ) : (
                        <IoEyeOutline className="w-[20px] h-[20px] text-gray-700" />
                      )}
                    </div>
                    {errors?.confirmPassword && (
                      <p className="text-[14px] text-red-600 font-normal mt-1">
                        {errors?.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <button
                      className="w-full bg-black text-white text-[16px] font-semibold py-3 rounded mb-2 hover:bg-black transition cursor-pointer"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
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
}

export default forgotPassword;
