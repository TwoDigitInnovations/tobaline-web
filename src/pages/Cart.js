import React, { useContext, useEffect, useState, useMemo } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineMinimize } from "react-icons/md";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { cartContext, userContext } from "./_app";
import constant from "../../services/constant";
import namer from "color-namer";
import { Api } from "../../services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { produce } from "immer";
import Select from "react-select";
import countryList from "react-select-country-list";
import { CheckCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEO from "../../components/SEO";

const Cart = (props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [cancelPopup, setCancelPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [cartData, setCartData] = useContext(cartContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItem, setCartItem] = useState(0);
  const [user, setuser] = useContext(userContext);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    Name: "",
    address: "",
    State: "",
    city: "",
    phoneNumber: "",
    pinCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const countryoptions = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    if (user.id) {
      getProfile();
    }
  }, []);

  const getProfile = () => {
    Api("get", "auth/profile", "", router).then(
      (res) => {
        if (res?.data?.data) {
          const shipping = res.data.data;
          setFormData({
            Name: shipping.name || "",
            address: shipping.shippingAddress?.address || "",
            State: shipping?.shippingAddress?.State || "",
            city: shipping.shippingAddress?.city || "",
            phoneNumber: shipping.phone || "",
            pinCode: shipping?.shippingAddress?.pinCode || "",
            country: shipping?.shippingAddress?.country || "",
          });
        } else {
          console.log(res?.data?.message || "Something went wrong!");
        }
      },
      (err) => {
        console.log(err?.response?.data?.message || "Something went wrong!");
      },
    );
  };

  useEffect(() => {
    const sumWithInitial = cartData?.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue?.total || 0),
      0,
    );

    const sumWithInitial1 = cartData?.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue?.qty || 0),
      0,
    );

    setCartItem(sumWithInitial1);
    setCartTotal(sumWithInitial.toFixed(2));
  }, [cartData]);

  const getColorName = (hex) => {
    if (!hex) return "Default";

    try {
      const names = namer(hex);
      return names.basic[0].name;
    } catch (error) {
      console.error("Error getting color name:", error);
      return "Default";
    }
  };

  const handleIncreaseQty = (item) => {
    const existingItem = cartData.find(
      (cartItem) =>
        cartItem._id === item._id &&
        cartItem.selectedColor === item.selectedColor &&
        JSON.stringify(cartItem.attribute) === JSON.stringify(item.attribute),
    );

    if (!existingItem) return;

    if (existingItem.qty + 1 > item.Quantity) {
      props.toaster({
        type: "error",
        message:
          "Item is not available in this quantity in stock. Please choose a different item.",
      });
      return;
    }

    const nextState = produce(cartData, (draft) => {
      const itemToUpdate = draft.find(
        (cartItem) =>
          cartItem._id === item._id &&
          cartItem.selectedColor === item.selectedColor &&
          JSON.stringify(cartItem.attribute) === JSON.stringify(item.attribute),
      );

      if (itemToUpdate) {
        itemToUpdate.qty += 1;
        itemToUpdate.total = (
          parseFloat(itemToUpdate.price || 0) * itemToUpdate.qty
        ).toFixed(2);
      }
    });

    setCartData(nextState);
    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
  };
  const { paymentSuccess, paymentCancelled, session_id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    if (paymentSuccess === "true") {
      createProductRequest();
    }

    if (paymentCancelled === "true") {
      setCancelPopup(true);
    }
  }, [router.isReady, paymentSuccess, paymentCancelled]);

  const handleDecreaseQty = (item) => {
    const existingItem = cartData.find(
      (cartItem) =>
        cartItem._id === item._id &&
        cartItem.selectedColor === item.selectedColor &&
        JSON.stringify(cartItem.attribute) === JSON.stringify(item.attribute),
    );

    if (!existingItem) return;

    const nextState = produce(cartData, (draft) => {
      const itemToUpdate = draft.find(
        (cartItem) =>
          cartItem._id === item._id &&
          cartItem.selectedColor === item.selectedColor &&
          JSON.stringify(cartItem.attribute) === JSON.stringify(item.attribute),
      );

      if (itemToUpdate) {
        if (itemToUpdate.qty > 1) {
          itemToUpdate.qty -= 1;
          itemToUpdate.total = (
            parseFloat(itemToUpdate.price || 0) * itemToUpdate.qty
          ).toFixed(2);
        } else {
          const index = draft.indexOf(itemToUpdate);
          if (index > -1) {
            draft.splice(index, 1);
            toast.info("Item removed from cart");
          }
        }
      }
    });

    setCartData(nextState);
    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
  };

  const cartClose = (product, i) => {
    const nextState = produce(cartData, (draftState) => {
      if (i !== -1) {
        draftState.splice(i, 1);
      }
    });

    setCartData(nextState);
    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
    toast.info("Item removed from cart");
  };

  const createProductRequest = () => {
    if (!user) {
      props.toaster({
        type: "error",
        message: "Please login to place order",
      });
      return;
    }
    const billingData = JSON.parse(localStorage.getItem("billingFormData"));

    let data = cartData.map((element) => ({
      product: element?._id,
      image: element.selectedColor?.image || element.selectedImage,
      total: element.total,
      price: element.price,
      attribute: element.attribute,
      color: element.selectedColor,
      size: element.selectedSize,
      category: element.category,
      qty: element.qty,
      seller_id: element.userid,
    }));

    let newData = {
      productDetail: data,
      ShippingAddress: billingData,
      total: cartTotal,
      user: user.id,
      Email: user.email,
      session_id: session_id,
    };

    console.log("new Data", newData);
    props.loader && props.loader(true);

    Api("post", "product/createProductRequest", newData, router).then(
      (res) => {
        props.loader && props.loader(false);
        if (res.status) {
          setCartData([]);
          setCartTotal(0);
          setFormData([]);
          localStorage.removeItem("addCartDetail");
          setSuccessPopup(true);
          router.push("/Cart");
          const order = res?.data?.orders;
          setOrderId(order?.orderId);
       
        } else {
          props.toaster({
            type: "sucess",
            message: res?.data?.message || "Something went wrong!",
          });
        }
      },
      (err) => {
        props.loader && props.loader(false);
        props.toaster({
          type: "error",
          message: err?.response?.data?.message || "Something went wrong!",
        });
      },
    );
  };
  const validate = () => {
    let newErrors = {};

    if (!formData?.Name?.trim()) newErrors.Name = "Name is required";

    if (!formData?.address?.trim()) newErrors.address = "Address is required";

    if (!formData?.city?.trim()) newErrors.city = "City is required";

    if (!formData?.State?.trim()) newErrors.State = "State is required";

    if (!formData?.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    else if (String(formData.phoneNumber).length !== 10)
      newErrors.phoneNumber = "Enter valid 10 digit phone number";

    if (!formData?.pinCode?.trim()) newErrors.pinCode = "Pin code is required";

    if (!formData?.country?.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
    localStorage.setItem("billingFormData", JSON.stringify(updatedFormData));
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const isValid = validate();
      if (!isValid) {
        setLoading(false);
         props.toaster({
          type: "success",
          message: "Please Complete Address",
        });
        return;
      }

      const bodyData = {
        cartItems: cartData.map((item) => ({
          _id: item._id,
          name: item.name,
          image: item.selectedColor?.image || item.selectedImage,
          quantity: item.qty,
          price: item.price,
        })),
        currency: constant.currencyName,
      };

      const response = await Api("post", "stripe/poststripe", bodyData, router);

      if (response?.url) {
        props.toaster({
          type: "success",
          message: "Redirecting to payment...",
        });
        window.location.href = response.url;
      } else {
        props.toaster({
          type: "error",
          message: "Failed to initialize checkout session",
        });
      }
    } catch (error) {
      props.toaster({
        type: "error",
        message: "Checkout failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const UpdateProfile = () => {
    validate();
    const data = {
      userId: user.id,
      name: formData.Name,
      phone: formData?.phoneNumber,
      shippingAddress: {
        address: formData?.address || "",
        State: formData?.State || "",
        city: formData?.city || "",
        pinCode: formData?.pinCode || "",
        country: formData?.country || "",
      },
    };

    props.loader(true);
    console.log(data);

    Api("post", "auth/updateprofile", data, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          props.toaster({
            type: "success",
            message: res?.message || "Profile updated successfully!",
          });
          getProfile();
          setOpen(false);
        } else {
          props.toaster({
            type: "error",
            message: res?.message || "Failed to update profile",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong",
        });
      },
    );
  };

  return (
    <>
      <SEO
        title="Your Shopping Cart | Tobaline"
        description="Review items in your cart and proceed securely to checkout at Tobaline."
        canonical="/Cart"
      />

      <div className="min-h-screen max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-center text-2xl md:text-3xl font-normal mt-4 md:mt-0 text-gray-800">
          {t("Shopping Cart")}
        </h1>
        <div className="text-black/70 md:mb-4 text-center">
          <ol className="inline-flex space-x-1 items-center text-sm md:text-base justify-center">
            <li
              className="text-black hover:underline cursor-pointer"
              onClick={() => router.push("/")}
            >
              {t("Home")}
            </li>

            <li>
              <span className="mx-1 text-black/50 text-base">
                <IoIosArrowForward />
              </span>
            </li>
            <li className="text-black">{t("Your Shopping Cart")}</li>
          </ol>
        </div>

        {cartData && cartData.length > 0 ? (
          <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4">
            <div className="md:w-2/3 bg-white rounded-3xl shadow-xl p-4">
              <div className="grid md:grid-cols-13 grid-cols-5 border-t border-b border-black/20 py-4 text-base md:text-lg font-normal text-custom-black">
                <div className="md:col-span-4 text-black col-span-2 font-semibold text-lg md:text-xl md:ms-0 ms-4">
                  {t("Product")}
                </div>
                <div className="md:col-span-3 text-black  col-span-1 font-semibold text-lg md:text-xl">
                  {t("Price")}
                </div>
                <div className="md:col-span-3 text-black  col-span-1 font-semibold text-lg md:text-xl">
                  {t("Quantity")}
                </div>
                <div className="md:col-span-3 text-black col-span-1 font-semibold text-lg md:text-xl md:ms-0 ms-4">
                  {t("Total")}
                </div>
              </div>

              {cartData.map((product, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 md:grid-cols-13 items-center border-b border-black/20 py-4 text-xs font-normal p-4"
                >
                  <div className="col-span-5 md:col-span-4 flex space-x-4">
                    <img
                      alt={product.name || "Product"}
                      className="w-24 h-24 object-cover rounded"
                      src={product.selectedImage || "/placeholder-image.jpg"}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                      onClick={() =>
                        router.push(`/product-details/${product?.slug}`)
                      }
                    />
                    <div>
                      <div className="md:text-lg text-[14px] w-full md:w-[80%] font-semibold leading-tight text-gray-800 mb-3">
                        {product.name || "Product Name"}
                      </div>
                      {product.selectedSize && (
                        <div className="md:text-[16px] text-black/50 mb-1">
                          {t("Size")}:{" "}
                          <span className="text-black/50">
                            {product.selectedSize || "Not found"}
                          </span>
                        </div>
                      )}

                      {/* {product?.attribute &&
                        Object.entries(product.attribute)
                          .filter(([key]) => key.toLowerCase() !== "color")
                          .map(([label, value], index) => (
                            <div
                              key={index}
                              className="md:text-[16px] text-black/50 mb-1"
                            >
                              {label}:{" "}
                              <span className="text-black/50">
                                {value || "Not found"}
                              </span>
                            </div>
                          ))} */}

                      {product.selectedColor && (
                        <div className="md:text-[16px] text-black/50 mb-3">
                          Color:{" "}
                          <span className="text-black/50">
                            {getColorName(product.selectedColor)}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => cartClose(product, i)}
                        className="mt-1 text-sm text-black/50 underline transition duration-150 ease-in-out hover:text-red-500 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5 md:col-span-3 text-gray-800 text-lg md:text-xl mt-2">
                    {constant.currency}
                    {product.Offerprice || 0}
                  </div>
                  <div className="col-span-5 md:col-span-3 mt-2 mb-2">
                    <div className="flex items-center justify-between border-2 border-gray-300 rounded-sm md:w-28 w-full h-9 bg-white overflow-hidden">
                      <button
                        onClick={() => handleDecreaseQty(product)}
                        className="border-r flex items-center justify-center w-8 h-full text-gray-600 hover:bg-gray-100 transition-colors "
                        aria-label="Decrease quantity"
                      >
                        <MdOutlineMinimize className="text-lg -mt-2" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={product.qty || 1}
                        readOnly
                        className="ps-1 w-8 text-center text-sm text-black bg-transparent outline-none"
                      />
                      <button
                        onClick={() => handleIncreaseQty(product)}
                        className="border-l flex items-center justify-center w-8 h-full text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <IoIosAdd className="text-lg" />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5 md:col-span-3 text-lg md:text-xl text-gray-800">
                    {constant.currency} {product.total || 0}
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-1/3 w-full max-w-md ml-auto px-4">
              <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="p-3 rounded-full bg-gray-100">
                    <svg
                      className="w-6 h-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 11c0 7-7.5 11-7.5 11S4.5 18 4.5 11a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {t("Delivery Address")}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="block font-medium text-gray-800">
                        {formData?.Name}
                      </span>

                      <span className="block">📞 {formData?.phoneNumber}</span>

                      {formData?.address && (
                        <span className="block">{formData?.address}</span>
                      )}

                      {(formData?.city || formData?.State) && (
                        <span className="block">
                          {formData?.city}
                          {formData?.city && formData?.State ? ", " : ""}
                          {formData?.State}
                        </span>
                      )}

                      {(formData?.pinCode || formData?.country) && (
                        <span className="block">
                          {formData?.pinCode} {formData?.country}
                        </span>
                      )}
                    </p>

                    <button
                      className="mt-1 text-xs font-semibold cursor-pointer text-black underline"
                      onClick={() => {
                        if (user.id) {
                          getProfile();
                        }

                        setOpen(true);
                      }}
                    >
                      {t("Change Address")}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("Order Summary")}
                  </h2>

                  <div className="flex justify-between text-gray-600">
                    <span>
                      {t("Subtotal")} ({cartItem} {t("items")})
                    </span>
                    <span>
                      {constant.currency}
                      {cartTotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>{t("Shipping")}</span>
                    <span className="text-green-600 font-semibold">
                      {t("Free")}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                    <span>{t("Total")}</span>
                    <span>
                      {constant.currency}
                      {cartTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  // onClick={createProductRequest}
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg transition-all disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
                >
                  <div className="text-left">
                    <p className="text-lg font-semibold">
                      {loading
                        ? "Redirecting..."
                        : `Pay ${constant.currency}${cartTotal}`}
                    </p>
                    <p className="text-xs opacity-80">
                      {t("Secure checkout powered by Stripe")}
                    </p>
                  </div>

                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c.667 0 2 .4 2 2s-1.333 2-2 2-2-.4-2-2 .667-2 2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a5 5 0 00-10 0v2M5 9h14v10H5V9z"
                    />
                  </svg>
                </button>

                <div
                  onClick={() => router.push("/Collection?category=All")}
                  className="text-center text-sm font-semibold text-black underline cursor-pointer hover:opacity-80"
                >
                  {t("Continue Shopping")}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center md:min-h-[450px] py-12">
            <img
              src="/empty-cart.png"
              alt="Empty cart"
              className="w-[200px] h-52 mb-6"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <p className="text-lg font-semibold text-gray-600 mb-2">
              {t("Your cart is empty")}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t("Add some items to get started!")}
            </p>
            <button
              className="mt-5 cursor-pointer px-6 py-3 text-white bg-black rounded transition duration-150 ease-in-out hover:bg-gray-800"
              onClick={() => router.push("/")}
            >
              {t("Browse Products")}
            </button>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className=" bg-white shadow-lg rounded-4xl p-4 lg:p-6 h-fit w-[350px] md:w-[550px] mx-auto relative h-[95vh] overflow-y-scroll scrollbar-hide overflow-scroll">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 md:mb-4">
                  {t("Shipping Address")}
                </h2>
                <X
                  onClick={() => setOpen(!open)}
                  size={24}
                  className="text-black cursor-pointer"
                />
              </div>

              <div className="space-y-4 sm:space-y-4 p-2">
                <div>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    placeholder={t("Name")}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-md text-gray-700 text-sm sm:text-base"
                  />
                  {errors.Name && (
                    <p className="text-sm text-red-600 mt-1">{errors.Name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t("Address*")}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-md text-gray-700 text-sm sm:text-base"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t("Town/City*")}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-md text-gray-700 text-sm sm:text-base"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="State"
                    value={formData.State}
                    onChange={handleChange}
                    placeholder={t("State*")}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-md text-gray-700 text-sm sm:text-base"
                  />
                  {errors.State && (
                    <p className="text-sm text-red-600 mt-1">{errors.State}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder={t("Phone Number*")}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-md text-gray-700 text-sm sm:text-base"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder={t("Postal Code*")}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-md text-gray-700 text-sm sm:text-base"
                  />
                  {errors.pinCode && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.pinCode}
                    </p>
                  )}
                </div>

                <div>
                  <Select
                    className="!min-h-[48px] bg-[#F5F5F5] text-black"
                    placeholder={t("Select Country")}
                    options={countryoptions}
                    value={countryoptions.find(
                      (option) => option.value === formData?.country?.value,
                    )}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: selectedOption.label,
                      }))
                    }
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        padding: "8px 4px",
                        fontSize: isMobile ? "14px" : "16px",
                      }),
                    }}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  onClick={UpdateProfile}
                  className="bg-black text-white py-2 w-full rounded-md mt-4 "
                >
                  {t("Update Address")}
                </button>
              </div>
            </div>
          </div>
        )}

        {cancelPopup && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-[9999] px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeIn">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 text-black w-16 h-16 flex justify-center items-center rounded-full text-4xl">
                  ⚠️
                </div>
              </div>

              <h2 className="text-center text-2xl font-semibold text-gray-800">
                Order Cancelled
              </h2>

              <p className="text-center text-gray-600 mt-2 text-sm">
                You were redirected back from Stripe. Your order has been
                cancelled successfully.
              </p>

              <div className="flex justify-between gap-4 mt-6">
                <button
                  onClick={() => {
                    setCancelPopup(false);
                    router.push("/");
                  }}
                  className="w-1/2 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium"
                >
                  Home
                </button>

                <button
                  onClick={() => {
                    setCancelPopup(false);
                    router.push("/Cart");
                  }}
                  className="w-1/2 bg-black cursor-pointer text-white py-2 rounded-lg font-medium shadow"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {successPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] px-4">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-4 md:p-8 relative animate-fadeIn">
              {/* Success Icon */}
              <div className="flex justify-center mb-5">
                <div className="bg-green-100 text-green-600 w-20 h-20 flex justify-center items-center rounded-full">
                  <CheckCircle className="w-12 h-12" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-center text-2xl font-bold text-gray-800">
                Payment Successful 🎉
              </h2>

              {/* Description */}
              <p className="text-center text-gray-600 mt-3 text-md leading-relaxed px-4">
                Payment completed successfully! Your order has been confirmed
                and is now being processed.
              </p>

              {/* Order ID Box */}
              <div className="mt-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
                <p className="text-md text-gray-500">Your Order Number</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  #{orderId}
                </p>
              </div>

              {/* Email Info */}
              <p className="text-center text-gray-500 text-md mt-4 px-6">
                A confirmation email with your order details will be sent to you
                shortly.
              </p>

              {/* Actions */}
              <div className="flex justify-between gap-4 mt-8">
                <button
                  onClick={() => {
                    setSuccessPopup(false);
                    router.push("/");
                  }}
                  className="w-1/2 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 py-2.5 rounded-xl font-medium transition"
                >
                  Go to Home
                </button>

                <button
                  onClick={() => {
                    setSuccessPopup(false);
                    router.push("/myorder");
                  }}
                  className="w-1/2 bg-black cursor-pointer hover:bg-gray-900 text-white py-2.5 rounded-xl font-medium shadow transition"
                >
                  View My Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
