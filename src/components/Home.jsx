import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const categories = ['Romance', 'Fantasy', 'Mystery', 'Historical'];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="text-center pt-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to Ahmad's Book Store
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          Discover your next favorite book! Browse by category or explore our full collection.
        </p>
        <div className="mt-8 flex justify-center">
          <img
            src="/booksImgs/laptop_1.webp"
            alt="Welcome"
            className="w-full sm:w-3/4 md:w-2/3 mx-auto h-auto object-cover rounded-xl shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <div className="mt-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-700">
          Browse by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category, index) => (
            <Link
              to={"/books/" + category.toLowerCase()}
              key={index}
              className="bg-linear-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl hover:cursor-pointer transform hover:scale-110 transition-transform duration-300 font-medium text-lg"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      
    </div>
  );
}
