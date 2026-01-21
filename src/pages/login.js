import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Api } from "../../services/service";
import { userContext } from "./_app";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const login = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);
  const [eyeIcon, setEyeIcon] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const data = {
      username: userDetail.email.toLowerCase(),
      password: userDetail.password,
    };

    props.loader(true);

    Api("post", "login", data, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          const userData = res.data;

          if (userData.status === "Suspended") {
            props.toaster({
              type: "error",
              message:
                "Your account has been suspended by our team. Please contact support.",
            });
            return;
          }

          router.push("/");
          localStorage.setItem("userDetail", JSON.stringify(userData));
          localStorage.setItem("token", userData.token);
          setUser(userData);
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

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  return (
    <>
      <div className="md:min-h-screen min-h-[700px] flex max-w-7xl mx-auto">
        <div className="w-full lg:w-1/2 flex items-center md:p-0 p-8 justify-center bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your Credentials to access your account
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Forgot password
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={eyeIcon ? "text" : "password"}
                    placeholder="Enter your password"
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
                Login
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  className="font-semibold cursor-pointer text-gray-900 hover:underline"
                  onClick={() => router.push("/singup")}
                >
                  Sign Up
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

export default login;
