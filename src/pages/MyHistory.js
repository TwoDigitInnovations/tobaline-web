import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Api } from "../../services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import namer from "color-namer";
import constant from "../../services/constant";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { RxCrossCircled } from "react-icons/rx";

const MyHistory = (props) => {
  const [orderData, setOrderData] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [productId, setProductId] = useState("");
  const [reviewsData, setReviewsData] = useState({
    description: "",
    reviews: 0,
  });

  useEffect(() => {
    getProductFromOrder();
  }, []);

  const getProductFromOrder = async () => {
    props.loader(true);
    setLoading(true);
    try {
      const res = await Api("get", "product/getHistoryProduct", "", router);
      setOrderData(res.data);
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      toast({ type: "error", message: err?.message });
    } finally {
      props.loader(false);
    }
  };
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const createProductRquest = (e) => {
    e.preventDefault();
    if (reviewsData?.reviews === 0) {
      props.toaster({ type: "success", message: "Rating is required" });
      return;
    }

    let data = {
      description: reviewsData?.description,
      product: productId._id,
      rating: reviewsData?.reviews,
    };

    console.log(data);
    props.loader(true);

    Api("post", "product/giverate", data, router).then(
      (res) => {
        props.loader(false);
        if (res.status) {
          setShowReviews(false);
          setReviewsData({
            description: "",
            reviews: 0,
          });
          setProductId("");
          toast.success("Reviews Submitted Successfully");
        } else {
          toast.error("error Submitted Review");
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error("error Submitted Review");
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-green-200 text-custom-green";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // if (loading) {
  //   return <MyOrdersSkeleton />;
  // }

  const getColorName = (hex) => {
    if (!hex) return "Default";

    const names = namer(hex);
    return names.basic[0].name; // e.g. 'blue', 'black', etc.
  };

  return (
    <div className="bg-white min-h-screen">
      {/* <header className="bg-black md:flex hidden">
        <img
          alt="Fresh vegetables including green bell peppers, tomatoes, and lettuce on a dark background"
          className="w-full object-cover"
          height="80"
          src="/Breadcrumbs.png"
        />
      </header> */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-center text-black text-2xl md:text-4xl font-semibold mb-6">
          My History
        </h1>

        <div className="space-y-4">

          {orderData.length > 0 ? (
            orderData.map((order, orderIndex) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >

                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col md:flex-row md:items-center gap-1i md:gap-6">
                      <div>
                        <span className="text-[14px] font-semibold text-gray-600">
                          Order ID:{" "}
                        </span>
                        <span className="font-semibold text-[16px] text-gray-800">
                          {order.orderId}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[14px] text-gray-600">
                          Total:{" "}
                        </span>
                        <span className="font-semibold text-[16px] text-gray-800">
                          ${order.total}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[14px] text-gray-600">
                          Order Date:{" "}
                        </span>
                        <span className="font-semibold text-[16px] text-gray-800">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          Order {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {order.productDetail.length} item
                        {order.productDetail.length > 1 ? "s" : ""}
                      </span>
                      {order.productDetail.length > 1 && (
                        <button
                          onClick={() => toggleOrderExpansion(order.orderId)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {expandedOrders[order.orderId] ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>


                <div>

                  <div className="grid grid-cols-1 md:grid-cols-6 border-b border-gray-200 py-4 px-4">
                    <div className="flex items-center gap-3 md:col-span-3">
                      <img
                        alt={order.productDetail[0]?.name}
                        className="w-18 h-18 object-cover rounded"
                        src={order.productDetail[0]?.image[0]}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm md:text-base">
                          {order.productDetail[0]?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong> Qty :</strong> {order.productDetail[0]?.qty}
                        </p>

                        {order.productDetail[0]?.color && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Color : </strong>{" "}
                            {getColorName(
                              order.productDetail[0]?.color
                            )}
                          </p>
                        )}

                        {order?.productDetail[0]?.attribute && (
                          Object.entries(order?.productDetail[0]?.attribute)
                            .filter(([key]) => key.toLowerCase() !== "color")
                            .map(([label, value], index) => (
                              <div key={index} className="md:text-[16px] text-gray-600 mb-1 font-semibold">
                                {label}: <span className="text-gray-600 font-normal">{value || "Not found"}</span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    <div className="flex items-center md:col-span-1 mt-6 md:mt-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Price: {constant.currency}
                          {order.productDetail[0]?.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 md:col-span-1 -mt-7 md:mt-0">
                      <button
                        className="bg-black text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors"
                        type="button"
                        onClick={() => {
                          setProductId(order.productDetail[0]?.product);
                          console.log("", order.productDetail[0]._id);
                          setShowReviews(true);
                        }}
                      >
                        Add Review
                      </button>

                    </div>
                  </div>


                  {order.productDetail.length > 1 &&
                    expandedOrders[order.orderId] && (
                      <>
                        {order.productDetail
                          .slice(1)
                          .map((product, productIndex) => (
                            <div
                              key={product._id}
                              className="grid grid-cols-1 md:grid-cols-6 border-b border-gray-200 py-4 px-4 bg-gray-50"
                            >
                              <div className="flex items-center gap-3 md:col-span-3">
                                <img
                                  alt={product.name}
                                  className="w-18 h-18 object-cover rounded"
                                  src={
                                    order.productDetail[productIndex + 1]?.image[0]
                                  }
                                />
                                <div>
                                  <h3 className="font-medium text-gray-900 text-sm md:text-base">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-1">
                                    <strong> Qty :</strong> {product?.qty}
                                  </p>


                                  {product?.color && (
                                    <p className="text-sm text-gray-600 mb-1">
                                      <strong>Color : </strong>{" "}
                                      {getColorName(product?.color || "Not Selected")}
                                    </p>
                                  )}

                                  {product?.attribute && (
                                    Object.entries(product.attribute)
                                      .filter(([key]) => key.toLowerCase() !== "color")
                                      .map(([label, value], index) => (
                                        <div key={index} className="md:text-[16px] text-gray-600 mb-1 font-semibold">
                                          {label}: <span className="text-gray-600 font-normal">{value || "Not found"}</span>
                                        </div>
                                      ))
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center md:col-span-1 mt-6 md:mt-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    Price: {constant.currency}
                                    {product.price}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 md:col-span-1 -mt-7 md:mt-0">
                                <button
                                  className="bg-black text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors"
                                  type="button"
                                  onClick={() => {
                                    setProductId(product.product);
                                    console.log("", product._id);
                                    setShowReviews(true);
                                  }}
                                >
                                  Add Review
                                </button>

                              </div>
                            </div>
                          ))}
                      </>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 min-h-[500px]">
              <div className="animate-bounce text-6xl mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v9a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-600">No History Available</p>
              <p className="text-lg text-gray-400 mt-2">Looks like you haven't placed any orders yet.</p>
            </div>

          )}

        </div>
      </main>

      {showReviews && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
          <div className="relative w-[350px] md:w-[560px] h-auto bg-white rounded-[15px] m-auto">
            <div
              className="absolute top-2 right-2 p-1 rounded-full text-black w-8 h-8 cursor-pointer"
              onClick={() => {
                setShowReviews(false);
              }}
            >
              <RxCrossCircled className="h-full w-full font-semibold " />
            </div>

            <form className="px-5 py-5" onSubmit={createProductRquest}>
              <p className="text-black font-semibold md:text-[24px] mb-3 mt-6 text-center">
                {"Leave a Review for Tobaline"}
              </p>
              <p className="text-black md:text-[16px] mb-4 mt-6 text-center">
                {"How would you rate experience at Tobaline?"}
              </p>

              <div className="flex flex-col justify-center items-center rounded-[10px] py-1 ">
                <Box
                  sx={{
                    width: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Rating
                    name="text-feedback"
                    value={reviewsData?.reviews}
                    onChange={(e, value) => {
                      console.log(e, value);
                      setReviewsData({ ...reviewsData, reviews: value });
                    }}
                    precision={0.5}
                    emptyIcon={
                      <StarIcon sx={{ opacity: 0.55, fontSize: "40px" }} />
                    }
                    icon={<StarIcon sx={{ fontSize: "40px" }} />}
                  />
                </Box>
              </div>

              <div className="w-full">
                <textarea
                  className="bg-white md:w-full w-full px-5 py-2 border-b border-b-black font-normal text-base text-black outline-none md:my-5 my-3"
                  rows={4}
                  placeholder={"Write a review...."}
                  value={reviewsData.description}
                  onChange={(e) => {
                    setReviewsData({
                      ...reviewsData,
                      description: e.target.value,
                    });
                  }}
                  required
                />
              </div>

              <div className="flex md:justify-start justify-center">
                <button
                  className="bg-black w-full cursor-pointer md:h-[50px] h-[40px] rounded-[5px] text-white font-normal text-base"
                  type="submit"
                >
                  {"Submit Review"}
                </button>
              </div>

              <p className="text-black md:text-[12px] mb-3 mt-2 ">
                {
                  "All reviews on Cool Co. Reviews are verified within 48 hours before posting to ensure authenticity and accuracy."
                }
                ?
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHistory;
