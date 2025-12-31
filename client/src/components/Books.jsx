import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function Books() {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books`)
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = books;
    if (category) {
      filtered = books.filter(
        book => book.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (search) {
      filtered = filtered.filter(
        book => book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    setSelectedBooks(filtered);
  }, [category, books, search]);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('adminLoggedIn') === 'true');
    };
    checkLogin();
    const onStorage = (e) => {
      if (e.key === 'adminLoggedIn') checkLogin();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handlePurchase = (book) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if book already in cart to increment quantity
    const existingIndex = cart.findIndex(item => item.id === book.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...book, quantity: 1, price: `$${book.price}` }); // Ensure price format
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`You have added "${book.title}" to your cart!`);
    window.scrollTo(0, 0);
  };

  const handleEdit = (book) => {
    // For now, navigate to admin panel
    navigate('/admin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading books...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Books` : 'All Books'}
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {selectedBooks.map((book) => (
            <div key={book.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={book.imgSrc} alt={book.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
                <p className="text-sm text-gray-500 mb-2">{book.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${book.price}</span>
                  {isLoggedIn ? (
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(book)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedBooks.length === 0 && !loading && (
          <p className="text-center text-gray-600 mt-8">No books found.</p>
        )}
      </div>
    </div>
  );
}
