import React from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/router";

const ProductCard = ({ product, url, key }) => {
  const router = useRouter();

  const route = () => {
    router.push(url);
  };
  return (
    <div className="rounded-lg overflow-hidden transition" key={key}>
      <div className="relative cursor-pointer" onClick={route}>
        <img
          src={product.varients?.[0]?.image[0]}
          alt={product.name}
          className="w-full h-[320px] object-cover"
        />
      </div>

      <div className="py-4 space-y-2">
        <h3 className="font-serif text-lg text-stone-800">{product.name}</h3>

        <p className="text-sm text-stone-500">from {product.origin}</p>
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={"#FACC15"} stroke="#FACC15" />
          ))}
          <span className="text-xs text-stone-500 ml-1">
            ({product.reviews || "58"})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-stone-800">
            ${product.varients[0].selected?.[0]?.offerprice}
          </span>

          {product.varients[0].selected?.[0]?.price && (
            <span className="text-sm line-through text-stone-400">
              ${product.varients[0].selected?.[0]?.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
