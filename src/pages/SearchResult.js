import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { Api } from "../../services/service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BiSearchAlt } from "react-icons/bi";

const SearchResult = (props) => {
  const router = useRouter();
  const inputRef2 = useRef();

  const [searchData, setSearchData] = useState("");
  const [productList, SetProductList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { t } = useTranslation();
  const fetchProducts = async (pageNum = 1) => {
    try {
      props.loader(true);
      const res = await Api(
        "get",
        `product/getTopSoldProduct?page=${pageNum}&limit=16`,
        null,
        router
      );

      if (res?.data) {
        SetProductList(res.data);
      }
      props.loader(false);
    } catch (err) {
      console.error(err);
      props.loader(false);
    }
  };

  const fetchSearchResult = async (text) => {
    if (!text.trim()) return;

    setIsSearching(true);
    props.loader(true);

    let url = `product/productsearch?key=${text}`;

    Api("get", url, "", router).then(
      (res) => {
        SetProductList(res.data || []);
        setIsSearching(false);
        props.loader(false);
      },
      (err) => {
        toast.error(err?.message);
        setIsSearching(false);
        props.loader(false);
      }
    );
  };

  // =========================
  // Handle Search
  // =========================
  const handleSearch = () => {
    if (searchData.trim()) {
      setIsSearchMode(true);
      fetchSearchResult(searchData);
    } else {
      setIsSearchMode(false);
      fetchProducts(1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchProducts(1);
  }, [router.isReady]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 ">
        <div className="max-w-7xl mx-auto px-4 md:px-0 pt-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center mx-auto max-w-[600px]">
            <div className="flex w-[340px] md:w-[550px] items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">
              
              <input
                type="text"
                ref={inputRef2}
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t("Search for products...")}
                className="w-full px-4 py-2.5 text-gray-700 bg-transparent focus:outline-none text-sm md:text-base"
              />

              {/* Clear Button */}
              {searchData && (
                <button
                  onClick={() => {
                    setSearchData("");
                    setIsSearchMode(false);
                    fetchProducts(1);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <RxCross2 className="h-5 w-5" />
                </button>
              )}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3.5 disabled:opacity-50"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Products Section ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">

        {/* Title */}
        {productList.length > 0 && (
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isSearchMode ? t("Search Results") : t("Top Products")}
            </h1>

            <div className="text-sm text-gray-500">
              {productList.length} {t("products found")}
            </div>
          </div>
        )}

   
        {productList.length > 0 ? (
          <div className="grid md:grid-cols-4 lg:grid-cols-4 grid-cols-2 gap-4">
            {productList.map((item, i) => (
              <ProductCard
                key={item?._id || i}
                {...props}
                product={item}
                i={i}
                url={`/product-details/${item?.slug}`}
              />
            ))}
          </div>
        ) : (
          
          isSearchMode && !isSearching && (
            <div className="flex flex-col justify-center items-center h-[550px] text-gray-600">
              <BiSearchAlt className="text-[80px] mb-4 text-gray-700" />
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                {t("No Products Found")}
              </h2>
              <p className="text-center max-w-[400px]">
                {t(
                  "Try checking spelling or search with different keywords"
                )}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchResult;
