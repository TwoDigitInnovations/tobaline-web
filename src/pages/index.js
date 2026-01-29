import { useEffect, useState } from "react";
import HeroSection from "../../components/HeroSection";
import { Api } from "../../services/service";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import "react-multi-carousel/lib/styles.css";
import Head from "next/head";
import { useContext } from "react";
import { userContext } from "./_app";
import CustomerReviews from "../../components/Testimonials";
import MindfulLuxury from "../../components/MindfulLuxury";
import ProductCard from "../../components/ProductCard";

export default function Home(props) {
  const { t } = useTranslation();
  const [user] = useContext(userContext);
  const router = useRouter();

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
      <div className="">
        <HeroSection />

        <div className="bg-[#D9D9D92E] relative w-full py-8 md:py-16">
          <div className="absolute inset-0 bg-[url('/images/monotonoise.png')] opacity-[0.03]" />
          <section className=" w-full relative flex flex-col justify-center items-center">
            <div className="container mx-auto px-2 md:px-0">
              <h1 className="text-4xl md:text-6xl md:mb-3 mb-0 text-black">
                {t("Our")}
              </h1>
              <h1 className="text-4xl md:text-6xl font-bold md:mb-10 mb-5 text-black">
                {t("Best Picks For You")}
              </h1>

              <BestSeller loader={props.loader} />
            </div>
          </section>
        </div>

        <MindfulLuxury />

        <CustomerReviews />
      </div>
    </>
  );
}

function BestSeller({ loader }) {
  const router = useRouter();
  const { t } = useTranslation();

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchProducts(1);
  }, [router.isReady]);

  const fetchProducts = async (pageNum) => {
    try {
      loader(true);
      const res = await Api(
        "get",
        `product/getTopSoldProduct?page=${pageNum}&limit=16`,
        null,
        router,
      );

      if (res?.data) {
        setProductList(res.data);
        loader(false);
      }
    } catch (err) {
      console.error(err);
      loader(false);
    }
  };

  return (
    <div className="flex flex-col relative">
      <div className="grid md:grid-cols-4 lg:grid-cols-4 grid-cols-2 gap-4 mx-auto w-full">
        {productList.length > 0 ? (
          productList.map((item, i) => (
            <ProductCard
              key={i}
              product={item}
              url={`/product-details/${item?.slug}`}
            />
          ))
        ) : (
          <div className="col-span-6 flex justify-center items-center text-[16px] text-gray-500 min-h-[200px]">
            {t("No products available")}.
          </div>
        )}
      </div>

      <div>
        <button
          className="md:text-[20px] bg-white border border-[#222222] text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-300 px-8 py-3 mt-12 w-full flex items-center justify-center rounded-md cursor-pointer"
          onClick={() => router.push("/Collection")}
        >
          {t("VIEW COLLECTIONS")}
        </button>
      </div>
    </div>
  );
}
