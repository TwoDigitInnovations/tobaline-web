import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Api } from "../../services/service";
import { toast } from "react-toastify";
import { IoFilterSharp } from "react-icons/io5";
import { Drawer } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { RiResetRightLine } from "react-icons/ri";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/ProductCard";
import SEO from "../../components/SEO";

const Collection = (props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedClothType, setselectedClothType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productList, setProductList] = useState([]);
  const [open, setOpen] = useState(false);
  const [colorsList, setColorList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clothTypes, setClothTypes] = useState([]);

  const [pagenation, setPagenation] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 4,
    mainLength: 0,
    dataLength: 0,
  });

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAllClothTypes = async () => {
    props.loader(true);
    try {
      const res = await Api("get", "clothtype/list", "", router);
      setClothTypes(res.data);
    } catch (err) {
      props.toaster({ type: "error", message: err?.message });
    } finally {
      props.loader(false);
    }
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
  };
  const [availabilityFilter, setAvailabilityFilter] = useState("available");

  const getAllCategories = async () => {
    props.loader(true);
    try {
      const res = await Api("get", "category/getCategories", "", router);
      setCategories([...res.data, { name: "All" }]);
    } catch (err) {
      toast({ type: "error", message: err?.message });
    } finally {
      props.loader(false);
    }
  };
  const availableCount = productList.filter(
    (product) => Number(product.pieces) > 0,
  ).length;

  const outOfStockCount = productList.filter(
    (product) => Number(product.pieces) === 0,
  ).length;

  useEffect(() => {
    getAllClothTypes();
    getAllCategories();
    getColors();

    if (router?.query?.type) {
      setselectedClothType(router.query.tyoe);
    } else {
      setselectedClothType(null);
    }
    console.log("fgh", router.query?.category);

    if (router?.query?.category) {
      setSelectedCategory(router.query.category);
    } else {
      setSelectedCategory("All");
    }
  }, [router?.query]);

  console.log(selectedCategory);

  useEffect(() => {
    if (
      selectedCategory === "All" ||
      (selectedClothType && selectedClothType.length > 0)
      //  || (selectedPriceRange && selectedPriceRange.length > 0) ||
      // (selectedColor && selectedColor.length > 0)
    ) {
      getproductByCategory(1);
    }
  }, [selectedClothType, selectedPriceRange, selectedColor, selectedCategory]);

  const getColors = async () => {
    props.loader(true);
    try {
      const res = await Api("get", "product/getColors", "", router);
      props.loader(false);
      setColorList(res.data.uniqueColors || []);
    } catch (err) {
      props.loader(false);
      console.log(err);
      toast.error(err?.message || "Error fetching categories");
    }
  };

  const getproductByCategory = async (page = 1) => {
    props.loader(true);

    let params = {
      page,
      limit: pagenation.limit,
    };

    if (selectedClothType) {
      params.clothTypeName = selectedClothType;
    }
    if (selectedSize) {
      params.size = selectedSize;
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange
        .replace(/\$/g, "")
        .split(" - ")
        .map(Number);
      params.minPrice = min;
      params.maxPrice = max;
    }

    if (selectedColor) {
      params.colors = selectedColor;
    }

    if (selectedCategory) {
      params.Category = selectedCategory;
    }

    try {
      const res = await Api(
        "get",
        "product/getProductBycategoryId",
        "",
        router,
        params,
      );
      props.loader(false);

      if (res.status) {
        setProductList(res.data.product);
        goToTop();
        let pagelimit = pagenation.pagelimit;

        if (page === 1) {
          let pagenationLimit = res.data.length / pagenation.limit;
          pagelimit = Math.ceil(pagenationLimit);
        }

        setPagenation({
          ...pagenation,
          mainLength: res.data.length,
          dataLength: res.data.product.length,
          currentPage: page,
          totalPages: pagelimit,
        });
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "Error fetching products");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const resetFilter = () => {
    getproductByCategory(1);
    setSelectedColor("");
    setSelectedPriceRange(0);
    setselectedClothType("");
    setSelectedSize("");
    setSelectedCategory("All");
  };

  const FilterContent = () => {
    const [openSection, setOpenSection] = useState("category");
    const toggle = (key) => setOpenSection(openSection === key ? "" : key);

    return (
      <div className="p-4 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("Filters")}</h2>

          <div className="flex items-center gap-2">
            <RiResetRightLine
              className="w-5 h-5 cursor-pointer"
              onClick={resetFilter}
            />
            <IoCloseOutline
              className="w-7 h-7 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">{t("Availability")}</h3>

          <label className="flex cursor-pointer items-center gap-2 text-[16px]">
            <input
              type="checkbox"
              checked={availabilityFilter === "available"}
              onChange={() =>
                setAvailabilityFilter(
                  availabilityFilter === "available" ? "" : "available",
                )
              }
            />
            {t("Availability")} ({availableCount})
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-[16px]">
            <input
              type="checkbox"
              checked={availabilityFilter === "outOfStock"}
              onChange={() =>
                setAvailabilityFilter(
                  availabilityFilter === "outOfStock" ? "" : "outOfStock",
                )
              }
            />
            {t("Out of Stock")} ({outOfStockCount})
          </label>
        </div>

        <hr />

        <div>
          <button
            onClick={() => toggle("category")}
            className="w-full flex cursor-pointer justify-between items-center text-[16px]"
          >
            {t("Category")}
            {openSection === "category" ? <IoChevronUp /> : <IoChevronDown />}
          </button>

          {openSection === "category" && (
            <div className="mt-2 space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="cursor-pointer flex gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.name}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <hr />

        <div>
          <button
            onClick={() => toggle("colors")}
            className="w-full flex cursor-pointer justify-between items-center text-[16px]"
          >
            {t("Colors")}
            {openSection === "colors" ? <IoChevronUp /> : <IoChevronDown />}
          </button>

          {openSection === "colors" && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {colorsList.map((color, i) => (
                <button
                  key={i}
                  style={{ backgroundColor: color }}
                  className={`w-5 h-5 rounded-full cursor-pointer border ${
                    selectedColor === color
                      ? "ring-2 ring-black"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? "" : color)
                  }
                />
              ))}
            </div>
          )}
        </div>

        <hr />

        <div>
          <button
            onClick={() => toggle("cloth")}
            className="w-full flex cursor-pointer justify-between items-center text-[16px]font-semibold"
          >
            {t("Cloth Type")}
            {openSection === "cloth" ? <IoChevronUp /> : <IoChevronDown />}
          </button>

          {openSection === "cloth" && (
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
              {clothTypes.map((type) => (
                <label
                  key={type._id}
                  className="cursor-pointer flex gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedClothType === type.name}
                    onChange={() =>
                      setselectedClothType(
                        selectedClothType === type.name ? "" : type.name,
                      )
                    }
                  />
                  {type.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <hr />

        <div>
          <button
            onClick={() => toggle("rating")}
            className="w-full flex justify-between cursor-pointer items-center text-[16px] "
          >
            {t("Ratings")}
            {openSection === "rating" ? <IoChevronUp /> : <IoChevronDown />}
          </button>

          {openSection === "rating" && (
            <div className="mt-2 space-y-2 text-sm">
              {[5, 4, 3, 2, 1].map((rate) => (
                <label key={rate} className="cursor-pointer flex gap-2">
                  <input type="checkbox" />
                  {"⭐".repeat(rate)}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePageChange = (page) => {
    setPagenation((prev) => ({ ...prev, currentPage: page }));
    getproductByCategory(page);
  };

  return (
    <>
      <SEO
        title="Shop Collections | Tobaline"
        description="Explore curated collections of everyday essentials and clothing at Tobaline."
        canonical="/Collection"
      />

      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 ">
          <div className="relative max-w-7xl mx-auto md:0 mt-4 px-6 py-4 md:py-2 mb-2">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 text-center">
              {t("All Collection")}
            </h1>

            <button
              onClick={handleOpenDrawer}
              className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center text-[18px] text-gray-800"
            >
              <span className="md:inline hidden">{t("Filters")}</span>
              <IoFilterSharp className="ml-2 text-[22px]" />
            </button>
          </div>
        </header>

        <div className="md:max-w-7xl mx-auto px-2 py-4 md:mb-4">
          <div className="flex">
            <Drawer
              open={open}
              onClose={handleClose}
              anchor="right"
              PaperProps={{
                style: {
                  width: "450px",
                  maxWidth: "90vw",
                },
              }}
            >
              <div className="w-full">
                <FilterContent />
              </div>
            </Drawer>

            <div className="max-w-7xl mx-auto w-full">
              {productList?.length > 0 ? (
                <div className="grid md:grid-cols-4 lg:grid-cols-4 grid-cols-2 gap-4">
                  {productList.map((item, i) => (
                    <ProductCard
                      key={item?._id || i}
                      product={item}
                      url={`/product-details/${item?.slug}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full flex flex-col justify-center items-center py-12 min-h-[550px]">
                  <img
                    src="/market.jpg"
                    alt="market"
                    className="md:w-[30vw] w-[60vw] mt-10"
                  />
                  <p className="text-gray-500 md:text-2xl text-xl">
                    {t("No products Available")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-6 w-full flex justify-center mt-8 mb-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagenation.currentPage - 1)}
                disabled={pagenation.currentPage === 1}
                className={`px-3.5 py-3 rounded-md ${
                  pagenation.currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white"
                }`}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: pagenation.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page <= 2 ||
                    page > pagenation.totalPages - 2 ||
                    Math.abs(page - pagenation.currentPage) <= 1
                  );
                })
                .reduce((acc, page, index, arr) => {
                  if (index > 0 && page - arr[index - 1] > 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, index) => {
                  if (item === "ellipsis") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        item === pagenation.currentPage
                          ? "bg-black text-white"
                          : "text-black bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}

              <button
                onClick={() => handlePageChange(pagenation.currentPage + 1)}
                disabled={pagenation.currentPage === pagenation.totalPages}
                className={`px-3.5 py-3 rounded-md ${
                  pagenation.currentPage === pagenation.totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
