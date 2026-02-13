import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { cartContext, userContext, favoriteProductContext } from "../_app";
import { Api } from "../../../services/service";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import Head from "next/head";
import SEO from "../../../components/SEO";

function ProductDetails(props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productsId, setProductsId] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageList, setSelectedImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [productReviews, setProductReviews] = useState([]);
  const [cartData, setCartData] = useContext(cartContext);
  const [isInCart, setIsInCart] = useState(false);
  const [availableQty, setAvailableQty] = useState(1);
  const carouselRef = useRef();
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goToSlide(0);
    }
  }, [selectedImageList]);

  useEffect(() => {
    if (router?.query?.slug) {
      getProductById();
    }
  }, [router?.query?.slug]);

  useEffect(() => {
    if (productsId?.varients?.length > 0) {
      const defaultColor = productsId?.varients[0];
      const defaultGroup = defaultColor?.selected?.[0];

      const mappedAttributes = {};
      defaultGroup?.attributes?.forEach((attr) => {
        mappedAttributes[attr.label] = attr.value;
      });

      setSelectedColor(defaultColor);
      setSelectedSize(defaultGroup);
      setSelectedAttributes(mappedAttributes);
      setSelectedImageList(defaultColor?.image || []);
      setSelectedImage(defaultColor?.image?.[0] || "");
    }
  }, [productsId]);

  const htmlContent = productsId?.long_description || "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "");
  const words = plainText.split(/\s+/);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCartLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;

    if (cartData.length > 0) {
      const cartItem = cartData.find(
        (f) =>
          f._id === productsId?._id &&
          f.price_slot?.value === selectedSize?.value,
      );

      if (cartItem) {
        setIsInCart(true);
        setAvailableQty(cartItem.qty);
      } else {
        setIsInCart(false);
        setAvailableQty(1);
      }
    } else {
      setIsInCart(false);
      setAvailableQty(1);
    }
  }, [cartData, productsId, selectedSize, cartLoaded]);

  const handleAddToCart = () => {
    if (!productsId || !productsId._id || !selectedSize?.offerprice) {
      console.error(
        "Invalid product data or size selection:",
        productsId,
        selectedSize,
      );
      return;
    }

    if (productsId.Quantity <= 0) {
      toast.info(
        "This item is currently out of stock. Please choose a different item.",
      );
      return;
    }

    const selectedPrice = {
      price: selectedSize?.price || 0,
      offerprice: selectedSize?.offerprice || 0,
    };

    const existingItem = cartData.find(
      (f) =>
        f._id === productsId._id &&
        f.price_slot?.value === selectedPrice?.value &&
        f.selectedSize === selectedSize?.value &&
        f.selectedColor === selectedColor?.color,
    );

    let ourPrice = parseFloat(selectedPrice?.offerprice);

    if (!existingItem) {
      const newProduct = {
        ...productsId,
        selectedColor: selectedColor?.color || "",
        selectedSize: selectedSize?.value || "",
        selectedImage: selectedColor?.image?.[0] || "",
        qty: availableQty,
        attribute: selectedAttributes,
        total: (parseFloat(ourPrice || 0) * availableQty).toFixed(2),
        Offerprice: ourPrice,
        category: productsId.category,
        price_slot: selectedPrice,
        price: ourPrice,
      };

      const updatedCart = [...cartData, newProduct];
      setCartData(updatedCart);
      localStorage.setItem("addCartDetail", JSON.stringify(updatedCart));
      toast.success("Item added to cart");
    } else {
      console.log(
        "Product already in cart with this exact variant:",
        existingItem,
      );
      toast.info("This exact item is already in your cart");
    }
  };

  const isAlreadyInCart = cartData.some((item) => {
    const isSameProduct = item._id === productsId._id;
    const isSameColor = selectedColor?.color
      ? item.selectedColor === selectedColor.color
      : true;

    const isSameAttributes = selectedAttributes
      ? Object.entries(selectedAttributes).every(
          ([key, value]) => item.attribute?.[key] === value,
        )
      : true;

    return isSameProduct && isSameColor && isSameAttributes;
  });

  const handleIncreaseQty = () => {
    setAvailableQty((prevQty) => prevQty + 1);
  };

  const handleDecreaseQty = () => {
    if (availableQty > 1) {
      setAvailableQty((prevQty) => prevQty - 1);
    }
  };

  const getProductById = async () => {
    let url;

    url = `product/getProductBySlug?slug=${router?.query?.slug}`;

    props.loader(true);
    Api("get", url, {}, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        res.data.qty = 1;
        res.data.total = (res.data?.Offerprice * res.data.qty).toFixed(2);
        setProductsId(res.data);
        setSelectedColor(res.data?.varients[0]);
        setSelectedSize(res.data?.varients[0]?.selected[0]);
        setSelectedImageList(res.data?.varients[0].image);
        setSelectedImage(res.data?.varients[0].image[0]);
        setProductReviews(res.data?.reviews || []);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast({ type: "error", message: err?.message });
      },
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => props.loader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getAttributeValue = (group, label) => {
    const found = group?.attributes?.find((attr) => attr.label === label);
    return found?.value || "";
  };

  let isCombinationAvailable;

  if (productsId?.varients?.length > 0) {
    isCombinationAvailable = productsId.varients.some((variant) => {
      const isColorMatch =
        variant.color?.toLowerCase() === selectedColor?.color?.toLowerCase();

      if (!isColorMatch) return false;
      if (!selectedAttributes || Object.keys(selectedAttributes).length === 0)
        return false;

      return variant.selected?.some((selectedGroup) => {
        return Object.entries(selectedAttributes).every(([label, value]) => {
          if (label.toLowerCase() === "color") return true;
          const valueInVariant = getAttributeValue(selectedGroup, label);
          return valueInVariant === value;
        });
      });
    });
  }

  return (
    <>
      <SEO
        title={productsId.metatitle || ""}
        description={
          productsId?.metadescreption ||
          "Get in touch with Tobaline support for queries, feedback, or assistance."
        }
        canonical={`product-details/${productsId.slug}`}
      />

      <div className="bg-white w-full min-h-screen">
        <main className="max-w-7xl mx-auto px-4 md:py-12 py-2 flex flex-col md:flex-row gap-8">
          <section className="flex gap-4 w-full md:w-1/2">
            <div className="flex flex-col items-start gap-2">
              <div className="rounded relative">
                <Carousel
                  ref={carouselRef}
                  className="md:w-[550px] w-[330px] h-[370px] md:h-[500px] object-fill md:object-contain"
                  responsive={responsive}
                  autoPlay={false}
                  // infinite={true}
                  // arrows={true}
                  customTransition="all 0.3s"
                  additionalTransfrom={0}
                  ssr={true}
                  partialVisible={false}
                  itemClass="image-item"
                  beforeChange={(nextSlide) => setSelectedIndex(nextSlide)}
                  customSliderIndex={selectedIndex} // 🔥 This line syncs selected image
                >
                  {selectedImageList?.map((item, i) => (
                    <div key={i} className="bg-white md:w-full h-[550px]">
                      <img
                        className="h-full w-full object-contain rounded"
                        src={item}
                        alt={`Product image ${i}`}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 ">
                {selectedImageList?.map((item, i) => (
                  <img
                    key={i}
                    alt={`Thumbnail ${i + 1}`}
                    className={`w-30 h-30 object-contain cursor-pointer border rounded-lg flex-shrink-0 ${
                      selectedIndex === i
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    src={item}
                    onClick={() => {
                      setSelectedIndex(i);
                      carouselRef.current?.goToSlide(i); // go to exact image
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="flex-1 w-full md:w-1/2">
            <div className="flex justify-between items-center gap-1 mb-2">
              <p className="text-[#757575] text-2xl">
                {productsId?.type || "Cotton dress"}{" "}
              </p>
              <div className="text-black text-2xl flex items-center">
                <FaStar className="text-yellow-500" />
                <span className="text-2xl text-gray-800">
                  ({productReviews?.length || 4.5})
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start mb-1">
              <h1 className="text-gray-600 text-6xl">{productsId?.name}</h1>
            </div>

            <div className="flex flex-col items-start ">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-[32px] line-through   text-black ${
                    isCombinationAvailable === false
                      ? "blur-[2px] opacity-800"
                      : ""
                  }`}
                >
                  ${selectedSize?.price}
                </span>

                {selectedSize?.price && (
                  <>
                    <span
                      className={`bg-red-500 text-white text-[10px] font-semibold px-2 py-1.5 rounded-xl ${
                        isCombinationAvailable === false
                          ? "blur-[2px] opacity-800"
                          : ""
                      }`}
                    >
                      SAVE{" "}
                      {Math.round(
                        ((selectedSize?.price - selectedSize?.offerprice) /
                          selectedSize?.price) *
                          100,
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
              <span
                className={` text-black font-semibold text-[32px] ${
                  isCombinationAvailable === false
                    ? "blur-[2px] opacity-800"
                    : ""
                }`}
              >
                ${selectedSize?.offerprice}
              </span>
              {!isCombinationAvailable && (
                <p className="text-red-500 font-semibold">Not available</p>
              )}
            </div>
            <div
              className="
    text-gray-700 text-[18px] leading-7
    [&_*]:!text-gray-700
    [&_*]:!font-normal
    [&_*]:!text-[18px]
    [&_strong]:!font-semibold
    [&_b]:!font-semibold
    [&_h1]:!text-[22px]
    [&_h2]:!text-[20px]
    [&_h3]:!text-[18px]
  "
              dangerouslySetInnerHTML={{
                __html: productsId?.long_description,
              }}
            />

            {productsId?.varients?.length > 0 && (
              <>
                {(() => {
                  return (
                    <>
                      {productsId?.Attribute?.filter(
                        (attr) => attr.name.toLowerCase() !== "color",
                      ).map((attribute, index) => {
                        const label = attribute.name;
                        const options = Array.from(
                          new Set(
                            productsId.varients
                              .filter(
                                (variant) =>
                                  variant.color?.toLowerCase() ===
                                  selectedColor?.color?.toLowerCase(),
                              )
                              .flatMap((variant) =>
                                variant.selected?.flatMap(
                                  (group) =>
                                    group?.attributes?.find(
                                      (attr) => attr.label === label,
                                    )?.value,
                                ),
                              )
                              .filter(Boolean),
                          ),
                        );

                        return (
                          <div className="w-full " key={index}>
                            <div className="flex flex-col justify-start items-start gap-3">
                              <p className="text-black text-xl font-normal">
                                {label}:
                                <span className="font-normal text-[16px] px-2">
                                  {selectedAttributes[label] || "Not selected"}
                                </span>
                              </p>

                              <div className="flex justify-start items-center gap-3 flex-wrap">
                                {options.map((option, j) => (
                                  <button
                                    key={j}
                                    onClick={() => {
                                      setSelectedAttributes((prev) => ({
                                        ...prev,
                                        [label]: option,
                                      }));

                                      const matchedVariant =
                                        productsId.varients.find(
                                          (variant) =>
                                            variant.color?.toLowerCase() ===
                                              selectedColor?.color?.toLowerCase() &&
                                            variant.selected?.some((group) =>
                                              group.attributes?.some(
                                                (attr) =>
                                                  attr.label === label &&
                                                  attr.value === option,
                                              ),
                                            ),
                                        );
                                      setSelectedSize(
                                        matchedVariant.selected[j],
                                      );
                                      if (matchedVariant) {
                                        setSelectedImageList(
                                          matchedVariant.image || [],
                                        );
                                        setSelectedImage(
                                          matchedVariant.image?.[0] || "",
                                        );
                                      }
                                    }}
                                    className={`rounded border border-[#00000050] flex justify-center items-center ${
                                      selectedAttributes[label] === option
                                        ? "bg-[#12344D] text-white"
                                        : "bg-white text-[#12344d]"
                                    }`}
                                  >
                                    <p className="text-sm px-2 py-1.5 font-medium">
                                      {option}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {productsId.varients.some((v) => v.color?.trim()) && (
                        <div className="md:pt-5 pt-1 pb-5 flex justify-start items-center gap-5">
                          <p className="text-black font-normal md:text-xl text-lg Inter">
                            Colours:
                          </p>
                          <div className="flex gap-3">
                            {productsId.varients
                              .filter((variant) => variant.color?.trim() !== "")
                              .map((variant, i) => (
                                <button
                                  key={i}
                                  aria-label={`${variant.color} color option`}
                                  className={`w-6 h-6 rounded-full border-1 p-2 ${
                                    selectedColor === variant
                                      ? "border-gray-800 p-1 border-2"
                                      : "border-gray-400"
                                  }`}
                                  style={{
                                    backgroundColor:
                                      variant.color?.toLowerCase() || "#ccc",
                                  }}
                                  onClick={() => {
                                    setSelectedColor(variant);
                                    setSelectedImageList(variant.image || []);
                                    setSelectedImage(variant.image?.[0] || "");

                                    const defaultGroup = variant.selected?.[0];
                                    const mappedAttributes = {};
                                    defaultGroup?.attributes?.forEach(
                                      (attr) => {
                                        mappedAttributes[attr.label] =
                                          attr.value;
                                      },
                                    );

                                    setSelectedAttributes(mappedAttributes);
                                    setSelectedSize(defaultGroup);
                                  }}
                                />
                              ))}
                          </div>
                        </div>
                      )}

                      {!isCombinationAvailable && (
                        <p className="text-red-500 font-semibold mt-2">
                          Not available in this option
                        </p>
                      )}

                      <div className="mb-6 mt-4">
                        <p className="text-[16px] text-gray-800 font-semibold mb-1">
                          Quantity
                        </p>
                        <div className="flex items-center gap-3 max-w-full">
                          <div className="w-[150px] py-2 rounded flex justify-evenly items-center border-[1px] border-gray-300">
                            <button
                              aria-label="Decrease quantity"
                              className="rounded text-lg font-semibold text-gray-700"
                              onClick={handleDecreaseQty}
                            >
                              <FaMinus />
                            </button>
                            <span className="rounded text-black font-semibold text-[20px] text-center">
                              {availableQty}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              className="rounded text-lg font-semibold text-gray-700"
                              onClick={handleIncreaseQty}
                            >
                              <FaPlus />
                            </button>
                          </div>

                          {isAlreadyInCart ? (
                            <button
                              className="flex-1 cursor-pointer w-full  bg-black tracking-wider text-[20px] font-semibold rounded px-3 py-3 transition "
                              onClick={() => router.push("/Cart")}
                            >
                              Go to Cart
                            </button>
                          ) : (
                            <button
                              className={`flex-1 w-full text-[20px] tracking-wider cursor-pointer font-semibold rounded px-3 py-2 transition ${
                                isCombinationAvailable
                                  ? " text-white bg-black"
                                  : " text-red-500 border-2 cursor-not-allowed"
                              }`}
                              onClick={
                                isCombinationAvailable
                                  ? handleAddToCart
                                  : undefined
                              }
                              disabled={!isCombinationAvailable}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default ProductDetails;
