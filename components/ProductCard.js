"use client";
import React, { useContext, useState } from "react";
import { Plus, Minus, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { cartContext } from "@/pages/_app";
import constant from "../services/constant";

const ProductCard = ({ product, url, toaster }) => {
  const router = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const [cartData, setCartData] = useContext(cartContext);

  const variant = product?.varients?.[0];
  const selectedVariant = variant?.selected?.[0];

  const price = selectedVariant?.price || 0;
  const offerprice = selectedVariant?.offerprice || price;

  const size =
    selectedVariant?.attributes?.find((a) => a.label === "Size")?.value || "";

  const route = () => router.push(url);

  const cartItem = cartData.find(
    (item) =>
      item._id === product?._id &&
      item.selectedColor === variant.color &&
      item.selectedSize === size,
  );

  const handleAddToCart = () => {
    if (!product?._id || !selectedVariant) return;

    if (selectedVariant?.qty <= 0) {
      // toast.info("Out of stock");
      toaster({ type: "error", message: "Out of Stock" });

      return;
    }

    const selectedPrice = {
      price: selectedVariant?.price || 0,
      offerprice: selectedVariant?.offerprice || selectedVariant?.price || 0,
    };

    const ourPrice = parseFloat(selectedPrice.offerprice);
    const quantity = 1; // yahan qty selector nahi hai

    const existingItem = cartData.find(
      (f) =>
        f._id === product._id &&
        f.selectedColor === variant.color &&
        f.selectedSize === size,
    );

    if (existingItem) {
      toaster({
        type: "error",
        message: "This exact item is already in your cart",
      });
      setOpenCart(true);
      return;
    }

    const newProduct = {
      ...product,
      selectedColor: variant.color || "",
      selectedSize: size || "",
      selectedImage: variant?.image?.[0] || "",
      qty: quantity,
      attribute: selectedVariant?.attributes || [],
      total: (ourPrice * quantity).toFixed(2),
      Offerprice: ourPrice,
      category: product.category,
      price_slot: selectedPrice,
      price: ourPrice,
    };

    const updated = [...cartData, newProduct];
    setCartData(updated);
    localStorage.setItem("addCartDetail", JSON.stringify(updated));
    setOpenCart(true);
    toaster({ type: "success", message: "product added to cart" });
  };

  return (
    <div className="rounded-lg overflow-hidden transition relative">
      {/* IMAGE */}
      <div className="relative cursor-pointer" onClick={route}>
        <img
          src={variant?.image?.[0]}
          alt={product?.name}
          className="w-full h-full object-cover"
        />

        <div
          className="absolute right-2 bottom-2 bg-white p-1.5 cursor-pointer min-w-[32px] text-center"
          onClick={(e) => {
            e.stopPropagation();
            cartItem ? router.push("/Cart") : handleAddToCart();
          }}
        >
          {cartItem ? (
            // <span className="text-black font-medium">{cartItem.qty}</span>
            <ShoppingCart className="text-black" size={20} />
          ) : (
            <Plus className="text-black" size={20} />
          )}
        </div>
      </div>

      <div className="py-4 space-y-2">
        <h3 className="font-serif text-lg text-stone-800">{product?.name}</h3>

        <p className="text-sm text-stone-500">from {product?.origin}</p>

        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="#FACC15" stroke="#FACC15" />
          ))}
          <span className="text-xs text-stone-500 ml-1">(58)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-stone-800">
            {constant.currency} {offerprice}
          </span>

          {price > offerprice && (
            <span className="text-sm line-through text-stone-400">
              {constant.currency} {price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
