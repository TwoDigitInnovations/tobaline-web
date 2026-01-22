import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "../../services/service";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userContext } from "./_app";

// Validation schemas
const forgotPasswordEmailSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phoneNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
});

const initialValueEmail = {
  name: "",
  email: "",
  phoneNo: "",
};

function EditProfile(props) {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [showEmail, setShowEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    setValues,
  } = useFormik({
    initialValues: initialValueEmail,
    validationSchema: forgotPasswordEmailSchema,
    onSubmit: (value) => {
      UpdateProfile(value);
    },
  });

  const UpdateProfile = (value) => {
    const data = {
      userId: user.id,
      name: value.name,
      email: value.email,
      phoneNo: value.phoneNo,
    };

    props.loader(true);

    Api("post", "auth/updateprofile", data, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          props.toaster({
            type: "success",
            message: res?.message || "Profile updated successfully!",
          });
          setIsEditing(false);
          getUser();
        } else {
          toast.error(res?.message || "Failed to update profile");
        }
      },
      (err) => {
        props.loader(false);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong",
        );
      },
    );
  };

  const getUser = () => {
    if (!user?.id) {
      props.toaster({
        type: "error",
        message: "No user ID available",
      });
      return;
    }

    setLoading(true);
    props.loader(true);

    Api("get", "auth/profile", "", router).then(
      (res) => {
        setLoading(false);
        props.loader(false);

        console.log(res?.status);
        console.log(res?.data);
        console.log(res?.data?.data);

        if (res?.status && res?.data?.data) {
          const data = res.data.data;
          const fullName = data.name || "";
          setValues({
            name: fullName || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        } else {
          toast.error(res?.message || "Failed to fetch profile");
        }
      },
      (err) => {
        setLoading(false);
        props.loader(false);
        console.error("Profile fetch error:", err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong",
        );
      },
    );
  };

  useEffect(() => {
    if (user?.id) {
      getUser();
    }
  }, [user?.id]);

  return (
    <div className="md:min-h-screen min-h-[700px] flex max-w-7xl mx-auto">
      <div className="w-full lg:w-1/2 flex md:p-0 p-4 items-center justify-center bg-white">
        <div className="w-full max-w-[450px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 text-sm">
              Edit your Credentials to update your profile
            </p>
          </div>
          {loading && (
            <div className="text-center mb-4 text-black">
              <p>Loading profile...</p>
            </div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="md:w-md w-full">
              <div className="mb-4">
                <input
                  className={`w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder=" Name"
                  type="text"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
                {touched.name && errors.name && isEditing && (
                  <p className="text-[14px] text-red-600 font-normal mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  className={`w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="Email"
                  type="email"
                  value={values.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
                {touched.email && errors.email && isEditing && (
                  <p className="text-[14px] text-red-600 font-normal mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <input
                  className={`w-full px-4 py-2.5 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10 rounded-t ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="Phone Number"
                  type="tel"
                  value={values.phoneNo}
                  name="phoneNo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="10"
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
                {touched.phoneNo && errors.phoneNo && isEditing && (
                  <p className="text-[14px] text-red-600 font-normal mt-1">
                    {errors.phoneNo}
                  </p>
                )}
              </div>
            </div>

            <div className="">
              {!isEditing ? (
                <button
                  className="w-full bg-black text-white text-[16px] font-semibold py-2 rounded mb-2 hover:bg-gray-800 transition cursor-pointer"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    className="w-full bg-black text-white text-[16px] font-semibold py-2 rounded hover:bg-gray-800 transition cursor-pointer"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    className="w-full bg-gray-500 text-white text-[16px] font-semibold py-2 rounded hover:bg-gray-600 transition cursor-pointer"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      getUser();
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
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
  );
}

export default EditProfile;
