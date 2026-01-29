"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { Api } from "../../services/service";
import { useRouter } from "next/router";

function ContactUs(props) {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    props.loader(true);
    setIsSubmitting(true);

    const data = {
      name: formData.Name,
      Email: formData.email,
      subject: formData.subject.toLowerCase(),
      message: formData.message,
      phone: formData.phoneNumber,
    };
    console.log(data);

    Api("post", "contactus/create", data, router).then(
      (res) => {
        props.loader(false);
        props.toaster({
          type: "success",
          message: res?.message || "Querry sent successfully!",
        });
        setIsSubmitting(false);
        setFormData({
          Name: "",
          email: "",
          phoneNumber: "",
          subject: "",
          message: "",
        });
      },
      (err) => {
        props.loader(false);
        console.log(err);
        setIsSubmitting(false);
        toast.error(err?.message || "Something went wrong");
        props.toaster({
          type: "error",
          message: err?.message || "Something went wrong Failed!",
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

      <div className="min-h-screen bg-gray-50 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="">
                <img
                  src="/images/imagecontactus.png"
                  alt="Folded towels"
                  className="rounded-lg shadow-lg w-full h-full object-cover"
                />
              </div>

              <div className="p-8 md:p-12 bg-white">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                  ToBa Line
                </h1>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Address:
                      </p>
                      <p className="text-gray-600">
                        123 Studio Street, Creative District
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Phone:
                      </p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Email:
                      </p>
                      <p className="text-gray-600">contact@tobaline.com</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-serif font-semibold text-gray-900 mb-3">
                    Studio Store
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur. Varius odio lobortis
                    vel esuada sollicitudin. Metus euismod in leo velit sed non
                    et. Nec suspendisse pede eifigatur dolor quam.
                  </p>
                </div>

                <button
                  onClick={() =>
                    window.open("https://maps.google.com", "_blank")
                  }
                  className="mt-8 w-full bg-black cursor-pointer text-white py-3 px-6 font-medium tracking-wide hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  GET DIRECTION
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-8">
              Contact
            </h2>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <input
                    type="text"
                    name="Name"
                    placeholder="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.Name ? "border-red-500" : "border-gray-300"} text-black focus:outline-none focus:border-gray-900 transition-colors duration-200`}
                  />
                  {errors.Name && (
                    <p className="mt-1 text-sm text-red-500">{errors.Name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} text-black focus:outline-none focus:border-gray-900 transition-colors duration-200`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors duration-200"
                />
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-black border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors duration-200"
                />
              </div>

              <div className="mb-6">
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border text-black ${errors.message ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-gray-900 transition-colors duration-200 resize-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-black cursor-pointer text-white py-4 px-6 font-medium tracking-wide hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
