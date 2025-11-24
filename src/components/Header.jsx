import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const getCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCount(cart.length);
      }
      getCartCount();
      const onStorage = (e) => {
        if (e.key === 'cart') getCartCount();
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCount(cart.length);
      }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className=' text-black flex justify-around p-4 text-xl shadow-md bg-white  '>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/books'>Books</Link>
            <Link to='/contact'>Contact</Link>
            <Link to='/shopping-cart' className='relative'>
                <FaShoppingCart size={24} />
              {count > 0 && (
                <span className='absolute -top-2 -right-5 bg-red-500 text-white rounded-full w-5 h-5 text-center text-xs'>{count}</span>
              )}
            </Link>
        </div>
    )
}
