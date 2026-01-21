import React from "react";
import { Star, User } from "lucide-react";

const ReviewCard = ({ name, date, rating, text }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0 items-center flex justify-center"> <User size={28}/></div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
};

const CustomerReviews = () => {
  const reviews = [
    {
      name: "CYNTHIA CAROLINE",
      date: "15 July 2023",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur. Suspendisse tortor scelerisque morbi vulputate. Quisque lobortum eget id diam elementum fringilla duis. Juaculius placerat dictum quis fringilla eu amet semper et nulla.",
    },
    {
      name: "CYNTHIA CAROLINE",
      date: "15 July 2023",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur. Suspendisse tortor scelerisque morbi vulputate. Quisque lobortum eget id diam elementum fringilla duis. Juaculius placerat dictum quis fringilla eu amet semper et nulla. ",
    },
    {
      name: "CYNTHIA CAROLINE",
      date: "15 July 2023",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur. Suspendisse tortor scelerisque morbi vulputate. Quisque lobortum eget id diam elementum fringilla duis. Juaculius placerat dictum quis fringilla eu amet semper et nulla. ",
    },
  ];

  return (
    <div className=" bg-[#F2F2F2] py-14 px-4">
      <div className="">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-gray-900">
          Customer Reviews
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
