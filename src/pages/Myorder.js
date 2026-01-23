import React, { useEffect, useState } from "react";

import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Api } from "../../services/service";
import { useRouter } from "next/router";
// import MyOrdersSkeleton from "@/components/MyOrderSkelton";
import { toast } from "react-toastify";
import namer from "color-namer";
import constant from "../../services/constant";

const MyOrder = (props) => {

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProductFromOrder();
  }, []);

  const getProductFromOrder = async () => {
    props.loader(true);
    setLoading(true);
    try {
      const res = await Api("get", "product/getrequestProduct", "", router);
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

  const getColorName = (hex) => {
    if (!hex) return "No Selected Color";

    const names = namer(hex);
    return names.basic[0].name; // e.g. 'blue', 'black', etc.
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-center text-black text-2xl md:text-4xl font-semibold mb-6">
          My Orders
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
                        onClick={() => {
                          router.push(
                            `/myorder/${order._id}?product_id=${order.productDetail[0]?._id}`
                          );
                        }}
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
                        className="bg-green-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
                        type="button"
                        onClick={() => router.push(`/product-details/${order?.productDetail[0]?.product?.slug}`)}
                      >
                        Order Again
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
                                  onClick={() => {
                                    router.push(
                                      `/myorder/${order._id}?product_id=${order.productDetail[productIndex + 1]?._id}`
                                    );
                                  }}
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
                                  className="bg-green-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
                                  type="button"
                                  onClick={() => router.push("/ShopNow")}
                                >
                                  Order Again
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
              <p className="text-xl font-semibold text-gray-600">No Orders Available</p>
              <p className="text-lg text-gray-400 mt-2">Looks like you haven't placed any orders yet.</p>
            </div>

          )}
        </div>
      </main>
    </div>
  );
};

export default MyOrder;
