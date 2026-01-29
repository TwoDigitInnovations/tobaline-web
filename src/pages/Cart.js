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
import { X } from "lucide-react";

const Cart = (props) => {
  const router = useRouter();
  const [cartData, setCartData] = useContext(cartContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItem, setCartItem] = useState(0);
  const [user, setuser] = useContext(userContext);
  const [open, setOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentPayPal, setShowPaymentPaypal] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const { redirect_status } = router.query;
  const [allowPayPal, setAllowPayPal] = useState(false);
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
    getProfile();
  }, []);

  const getProfile = () => {
    const requestData = { userId: user?.id };

    Api("get", "auth/profile", "", router).then(
      (res) => {
        if (res?.data?.shippingAddress) {
          const shipping = res.data.data;
          setFormData({
            Name: shipping.Name || "",
            address: shipping.address || "",
            State: shipping.State || "",
            city: shipping.city || "",
            phoneNumber: shipping.phoneNumber || "",
            pinCode: shipping.pinCode || "",
            country: shipping.country || "",
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

  const { paymentSuccess, paymentCancelled } = router.query;

  useEffect(() => {
    console.log("Payment status:", paymentSuccess, paymentCancelled);
    if (paymentSuccess) {
      handlePaymentSuccess(); // ✅
    } else if (paymentCancelled) {
      toast.error("Payment cancelled");
    }
  }, [paymentSuccess, paymentCancelled]);

  useEffect(() => {
    if (redirect_status === "succeeded") {
      handlePaymentSuccess();
    } else if (redirect_status === "failed") {
      toast.error("erorr");
    }
  }, [redirect_status]);

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
    // const billingData = JSON.parse(localStorage.getItem("billingFormData"));

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
          localStorage.removeItem("billingFormData");
          router.push("/MyOrder");

          props.toaster({
            type: "sucess",
            message:
              "Thank you for your order! Your item will be processed shortly.",
          });
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

  const handlePaymentSuccess = () => {
    props.toaster({
      type: "sucess",
      message: "Payment successful! Processing your order...",
    });
    createProductRequest();
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.Name.trim()) newErrors.Name = "First name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.State.trim()) newErrors.State = "State is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.pinCode.trim()) newErrors.pinCode = "Pin code is required";
    if (!formData.country) newErrors.country = "Country is required";
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

      const response = await Api("post", "poststripe", bodyData, router);

      if (response?.url) {
        window.location.href = response.url;
      } else {
        toast.error("Failed to initialize checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initialize checkout session");
    } finally {
      setLoading(false);
    }
  };

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
          getProfile();
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
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-center text-2xl md:text-3xl font-normal mt-4 md:mt-0 text-gray-800">
          {showPayment || showPaymentPayPal
            ? "Complete Payment"
            : "Shopping Cart"}
        </h1>
        <div className="text-black/70 md:mb-4 text-center">
          <ol className="inline-flex space-x-1 items-center text-sm md:text-base justify-center">
            <li
              className="text-black hover:underline cursor-pointer"
              onClick={() => router.push("/")}
            >
              Home
            </li>

            <li>
              <span className="mx-1 text-black/50 text-base">
                <IoIosArrowForward />
              </span>
            </li>
            <li className="text-black">
              {showPayment || showPaymentPayPal
                ? "Payment"
                : "Your Shopping Cart"}
            </li>
          </ol>
        </div>

        {cartData && cartData.length > 0 ? (
          <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4">
            <div className="md:w-2/3 bg-white rounded-3xl shadow-xl p-4">
              <div className="grid md:grid-cols-13 grid-cols-5 border-t border-b border-black/20 py-4 text-base md:text-lg font-normal text-custom-black">
                <div className="md:col-span-4 text-black col-span-2 font-semibold text-lg md:text-xl md:ms-0 ms-4">
                  Product
                </div>
                <div className="md:col-span-3 text-black  col-span-1 font-semibold text-lg md:text-xl">
                  Price
                </div>
                <div className="md:col-span-3 text-black  col-span-1 font-semibold text-lg md:text-xl">
                  Quantity
                </div>
                <div className="md:col-span-3 text-black col-span-1 font-semibold text-lg md:text-xl md:ms-0 ms-4">
                  Total
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
                    />
                    <div>
                      <div className="md:text-lg text-[14px] w-full md:w-[80%] font-semibold leading-tight text-gray-800 mb-3">
                        {product.name || "Product Name"}
                      </div>
                      {product.selectedSize && (
                        <div className="md:text-[16px] text-black/50 mb-1">
                          Size:{" "}
                          <span className="text-black/50">
                            {product.selectedSize || "Not found"}
                          </span>
                        </div>
                      )}

                      {product?.attribute &&
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
                          ))}

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
                        className="mt-1 text-sm text-black/50 underline transition duration-150 ease-in-out hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-5 md:col-span-3 text-gray-800 text-lg md:text-xl mt-2">
                    {constant.currency}
                    {product.price || 0}
                  </div>
                  <div className="col-span-5 md:col-span-3 mt-2 mb-2">
                    <div className="flex items-center justify-between border-2 border-gray-300 rounded-sm md:w-28 w-full h-9 bg-white overflow-hidden">
                      <button
                        onClick={() => handleDecreaseQty(product)}
                        className="border-r flex items-center justify-center w-8 h-full text-gray-600 hover:bg-gray-100 transition-colors -mt-2"
                        aria-label="Decrease quantity"
                      >
                        <MdOutlineMinimize className="text-lg" />
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
                      Delivery Address
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {/* Replace with dynamic address */}
                      {user?.address || "No address selected"}
                    </p>

                    <button
                      className="mt-1 text-xs font-semibold cursor-pointer text-black underline"
                      onClick={() => {
                        getProfile();
                        setOpen(true);
                      }}
                    >
                      Change Address
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Summary
                  </h2>

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItem} items)</span>
                    <span>
                      {constant.currency}
                      {cartTotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                    <span>Total</span>
                    <span>
                      {constant.currency}
                      {cartTotal}
                    </span>
                  </div>
                </div>

                <button
                  // onClick={handleCheckout}
                  onClick={createProductRequest}
                  disabled={loading}
                  className="
        w-full bg-black hover:bg-gray-800
        text-white px-6 py-4 rounded-2xl
        flex items-center justify-between
        shadow-lg transition-all
        disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed
      "
                >
                  <div className="text-left">
                    <p className="text-lg font-semibold">
                      {loading
                        ? "Redirecting..."
                        : `Pay ${constant.currency}${cartTotal}`}
                    </p>
                    <p className="text-xs opacity-80">
                      Secure checkout powered by Stripe
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
                  Continue Shopping
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
              Your cart is empty.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Add some items to get started!
            </p>
            <button
              className="mt-5 cursor-pointer px-6 py-3 text-white bg-black rounded transition duration-150 ease-in-out hover:bg-gray-800"
              onClick={() => router.push("/")}
            >
              Browse Products
            </button>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div
              className=" bg-white shadow-lg rounded-4xl p-4 lg:p-6 h-fit w-[350px] md:w-[550px] mx-auto relative
    "
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 md:mb-4">
                  Shipping Address
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
                    placeholder="Name"
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
                    placeholder="Address*"
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
                    placeholder="Town/City*"
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
                    placeholder="State*"
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
                    placeholder="Phone Number*"
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
                    placeholder="Postal Code*"
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
                    placeholder="Select Country"
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
                  // onClick={}
                  className="bg-black text-white py-2 w-full rounded-md mt-4 "
                >
                  Update Address
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
