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
  const { t } = useTranslation();

  const fetchSearchResult = async (text) => {
    if (!text.trim()) return;

    setIsSearching(true);
    let url = `product/productsearch?key=${text}`;

    props.loader(true);
    Api("get", url, "", router).then(
      (res) => {
        props.loader(false);
        setIsSearching(false);
        SetProductList(res.data);
      },
      (err) => {
        props.loader(false);
        setIsSearching(false);
        toast.error(err?.message);
      },
    );
  };

  const handleSearch = () => {
    if (searchData.trim()) {
      fetchSearchResult(searchData); // Only fetch results, no URL change
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  console.log(productList);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 md:mt-4 md:pt-4">
        <div className="max-w-7xl mx-auto px-4 md:px-12  md:pt-0 pt-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center mx-auto max-w-[600px]">
            <div
              className="flex w-[340px] md:w-[550px] items-center bg-white border-2 border-orange-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
              style={{ flexShrink: 0 }}
            >
              <input
                type="text"
                ref={inputRef2}
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t("Search for products...")}
                className="w-full px-4 py-2.5 text-gray-700 bg-transparent focus:outline-none text-sm md:text-base"
              />

              {searchData && (
                <button
                  onClick={() => {
                    setSearchData("");
                    SetProductList([]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                >
                  <RxCross2 className="h-5 w-5" />
                </button>
              )}

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3.5 transition-colors disabled:opacity-50 shrink-0"
              >
                <FaSearch className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            {productList.length > 0 && (
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {t("Search Results")}
              </h1>
            )}
          </div>

          {productList.length > 0 && (
            <div className="text-sm text-gray-500 md:mt-0">
              {productList.length} {t("product")}{productList.length !== 1 ? "s" : ""}{" "}
              {t("found")}
            </div>
          )}
        </div>

        {!isSearching && productList.length > 0 ? (
          <div className="grid md:grid-cols-4 lg:grid-cols-4 grid-cols-2 gap-4 mx-auto w-full">
            {productList?.map((item, i) => (
              // <div key={`${item.id || i}-${i}`} className="w-full">
              <ProductCard
                {...props}
                product={item}
                i={i}
                url={`/product-details/${item?.slug}`}
              />
              // </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-[550px] text-gray-600">
            <BiSearchAlt className="text-[80px] mb-4 text-orange-400" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {t("No Products Found")}
            </h2>
            <p className="text-center max-w-[400px] text-sm md:text-base">
              {t("We couldn’t find any results for your search. Try checking for typos or using different keywords")}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
