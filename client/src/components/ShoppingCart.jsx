import React, { useEffect, useState } from 'react'

export default function ShoppingCart() {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        address: '',
        mobile: ''
    });
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
    }, []);

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * (item.quantity || 1));
        }, 0).toFixed(2);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsCheckingOut(true);
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: customer.name,
                    customer_email: customer.email,
                    customer_address: customer.address,
                    customer_mobile: customer.mobile,
                    ordered_books: cart,
                    total_amount: calculateTotal()
                }),
            });

            if (response.ok) {
                alert('Order placed successfully!');
                clearCart();
                setCustomer({ name: '', email: '', address: '', mobile: '' });
            } else {
                const error = await response.json();
                alert('Error placing order: ' + error.message);
            }
        } catch (error) {
            alert('Error placing order: ' + error.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleCustomerChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen max-w-4xl mx-auto py-16 px-6">
            <h2 className="text-left text-2xl font-bold text-blue-600 mb-6">Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty. Browse <a className='text-blue-600 underline' href='/books'>books</a> to add items.</p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <p className='text-gray-700'>You have <span className='font-semibold'>{cart.length}</span> item{cart.length > 1 ? 's' : ''} in your cart.</p>
                        <div className='flex items-center gap-3'>
                            <button onClick={clearCart} className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'>Clear Cart</button>
                        </div>
                    </div>

                    <ol className='list-decimal list-inside space-y-4 mb-8'>
                        {cart.map((item, index) => (
                            <li key={item.id ?? index} className='bg-white shadow rounded p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                                <img src={item.imgSrc} alt={item.title} className='w-24 h-36 object-cover rounded' />
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                    <p className='text-sm text-gray-600'>By {item.author}</p>
                                    <p className='text-sm text-gray-500 mt-1'>{item.category}</p>
                                </div>
                                <div className='flex flex-col sm:items-end gap-2'>
                                    <p className='text-gray-800 font-bold'>Qty: {item.quantity} × ${parseFloat(item.price.replace('$', '')).toFixed(2)}</p>
                                    <p className='text-gray-800 font-bold'>Subtotal: ${(parseFloat(item.price.replace('$', '')) * (item.quantity || 1)).toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="bg-gray-50 p-4 rounded mb-8">
                        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                        <p className="text-xl font-bold text-blue-600">Total: ${calculateTotal()}</p>
                    </div>

                    <div className="bg-white shadow rounded p-6">
                        <h3 className="text-lg font-semibold mb-4">Checkout</h3>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customer.name}
                                    onChange={handleCustomerChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customer.email}
                                    onChange={handleCustomerChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={customer.address}
                                    onChange={handleCustomerChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={customer.mobile}
                                    onChange={handleCustomerChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCheckingOut}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {isCheckingOut ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    )
}
