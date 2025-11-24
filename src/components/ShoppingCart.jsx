import React, { useEffect, useState } from 'react'

export default function ShoppingCart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
    }, []);



    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };


    return (
        <div className="min-h-screen max-w-4xl mx-auto py-16 px-6">
            <h2 className="text-left text-2xl font-bold text-blue-600 mb-6">Your Purchased Books</h2>

            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty. Browse <a className='text-blue-600 underline' href='/books'>books</a> to add items.</p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <p className='text-gray-700'>You have <span className='font-semibold'>{cart.length}</span> item{cart.length > 1 ? 's' : ''} in your cart.</p>
                        <div className='flex items-center gap-3'>
                            <button onClick={clearCart} className='px-3 py-1 bg-red-500! text-white rounded hover:bg-red-600! transition'>Clear Cart</button>
                        </div>
                    </div>

                    <ol className='list-decimal list-inside space-y-4'>
                        {cart.map((item, index) => (
                            <li key={item.id ?? index} className='bg-white shadow rounded p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                                <img src={item.imgSrc} alt={item.title} className='w-24 h-36 object-cover rounded' />
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                    <p className='text-sm text-gray-600'>By {item.author}</p>
                                    <p className='text-sm text-gray-500 mt-1'>{item.category}</p>
                                </div>
                                <div className='flex flex-col sm:items-end gap-2'>
                                    {/* qty */}

                                    <p className='text-gray-800 font-bold'>{item.quantity} *  {item.price}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </div>
    )
}
