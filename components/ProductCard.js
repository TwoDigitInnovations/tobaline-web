import React from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/router";

const ProductCard = ({ product, url, key }) => {
  const router = useRouter();

  const route = () => {
    router.push(url);
  };
  return (
    <div
      className="rounded-lg overflow-hidden transition"
      key={key}
    >
      <div className="relative" onClick={route}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[320px] object-cover"
        />

        {product.discount && (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.discount}
          </span>
        )}
      </div>

  
      <div className="py-4 space-y-2">
        <h3 className="font-serif text-lg text-stone-800">{product.title}</h3>

        <p className="text-sm text-stone-500">from {product.country}</p>
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < product.rating ? "#FACC15" : "none"}
              stroke="#FACC15"
            />
          ))}
          <span className="text-xs text-stone-500 ml-1">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-stone-800">
            ${product.price}
          </span>

          {product.oldPrice && (
            <span className="text-sm line-through text-stone-400">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
