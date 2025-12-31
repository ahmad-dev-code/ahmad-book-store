import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    imgSrc: '',
    description: ''
  });
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }

    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'books') {
      fetchBooks();
    }
  }, [activeTab, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category,
      imgSrc: book.imgSrc || '',
      description: book.description || ''
    });
    // Scroll to form
    document.getElementById('book-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Book deleted successfully!');
        fetchBooks();
      } else {
        const error = await response.json();
        alert('Error deleting book: ' + error.message);
      }
    } catch (error) {
      alert('Error deleting book: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setNewBook({
      title: '',
      author: '',
      price: '',
      category: '',
      imgSrc: '',
      description: ''
    });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingBook 
        ? `${API_BASE_URL}/api/books/${editingBook.id}`
        : `${API_BASE_URL}/api/books`;
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert(editingBook ? 'Book updated successfully!' : 'Book added successfully!');
        resetForm();
        fetchBooks();
      } else {
        const error = await response.json();
        alert('Error saving book: ' + error.message);
      }
    } catch (error) {
      alert('Error saving book: ' + error.message);
    } finally {
      setLoading(false);
    } 
  };

  const handleBookChange = (e) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value
    });
  };

  console.log("orders",orders);
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 rounded ${
                activeTab === 'books'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Manage Books
            </button>
          </nav>
        </div>

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white shadow rounded p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p><strong>Name:</strong> {order.customer_name}</p>
                        <p><strong>Email:</strong> {order.customer_email}</p>
                        <p><strong>Mobile:</strong> {order.customer_mobile}</p>
                        <p><strong>Address:</strong> {order.customer_address}</p>
                        <p><strong>Total:</strong> ${order.total_amount}</p>
                        <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
                      </div>
                      <div
                      className='flex flex-row-reverse md:flex-col'
                      >
                        <h4 className="font-semibold mb-2">Ordered Books:</h4>
                        <ul className="list-disc list-inside">
                          {order && order.ordered_books && order.ordered_books.map((book, index) => (
                            <li key={index}>
                              {book.title} by {book.author} - Qty: {book.quantity} - ${book.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>

            <div className="bg-white shadow rounded p-6 mb-6" id="book-form">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
                {editingBook && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newBook.title}
                      onChange={handleBookChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={newBook.author}
                      onChange={handleBookChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={newBook.price}
                      onChange={handleBookChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={newBook.category}
                      onChange={handleBookChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Romance">Romance</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Historical">Historical</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      name="imgSrc"
                      value={newBook.imgSrc}
                      onChange={handleBookChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newBook.description}
                      onChange={handleBookChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? (editingBook ? 'Updating Book...' : 'Adding Book...') : (editingBook ? 'Update Book' : 'Add Book')}
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Existing Books</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <div key={book.id} className="bg-white shadow rounded p-4">
                    <img src={book.imgSrc} alt={book.title} className="w-full h-32 object-cover mb-2 rounded" />
                    <h4 className="font-semibold">{book.title}</h4>
                    <p className="text-sm text-gray-600">By {book.author}</p>
                    <p className="text-sm text-gray-500">{book.category}</p>
                    <p className="font-bold text-blue-600">${book.price}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}