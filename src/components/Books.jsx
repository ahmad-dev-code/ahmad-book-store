
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Books() {
  const { category } = useParams();
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [search, setSearch] = useState("");

  const books = [
    { id: 1, title: "BURN AFTER WRITING", author: "F. Scott Fitzgerald", imgSrc: "/booksImgs/BURNAFTERWRITING.webp",price: "$10.99",category:"romance" },
    { id: 2, title: "Getting over you", author: "F. Scott Fitzgerald", imgSrc: "/booksImgs/GEttingoveryou.webp",price: "$18.99",category:"fantasy" },
    { id: 3, title: "Haunting Adeline", author: "Harper Lee", imgSrc: "/booksImgs/HAUNTING_ADELINE.webp",price: "$10.99",category:"historical" },
    { id: 4, title: "It Starts With Us", author: "George Orwell", imgSrc: "/booksImgs/IT_STARTS_WITH_US.webp",price: "$22.99",category:"romance" },
    { id: 5, title: "It Ends With Us", author: "Jane Austen", imgSrc: "/booksImgs/ITENDswithus.webp",price: "$10.99",category:"romance" },
    { id: 6, title: "King Of Worth", author: "J.D. Salinger", imgSrc: "/booksImgs/KING_OF_WRATH.webp",price: "$33.99",category:"mystery" },
    { id: 7, title: "Picking Daisies On Sundays", author: "J.D. Salinger", imgSrc: "/booksImgs/pickigdaisiesonsundays.webp",price: "$10.99",category:"historical" },
    { id: 8, title: "The Seven Husbands Of Evelyn Hugo", author: "J.D. Salinger", imgSrc: "/booksImgs/SEVEN_HUSBANDS_OF_EVELYN_HUGO.webp",price: "$10.99",category:"mystery" },
    { id: 9, title: "Twisted Series", author: "J.D. Salinger", imgSrc: "/booksImgs/WhatsApp_Image_2024-10-30_at_12.21.47_PM.webp",price: "$70.99",category:"fantasy" },
  ]

useEffect(() => {
    if (category) {
      const filteredBooks = books.filter(
        book => book.category.toLowerCase() === category.toLowerCase()
      );
      setSelectedBooks(filteredBooks);
    } else {
      setSelectedBooks(books);
    }
  }, [category]);

  const handlePurchase = (e) => {
    alert(`Book added to cart!${e.title}`);

  }

 
    
  


  return (
    <div className='bg-gray-200 h-screen w-screen flex flex-col items-center gap-6 overflow-y-scroll p-4'>
      <input
        type='text'
        placeholder='Search by title or author...'
        value={search}
        onChange={e => setSearch(e.target.value)}
        className='mb-6 p-2 rounded border w-80 text-black'
      />
      {category && selectedBooks.length > 0 && (
        <h2 className='text-2xl font-semibold w-full'>{category}</h2>
      )}
      {!category && (
        <h2 className='text-2xl font-semibold w-full'>
          All Books
        </h2>
      )}

     <div
      className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
     >
       {(selectedBooks.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      )).map((book) => (
        <div key={book.id} className=' bookCard bg-white rounded-lg shadow-lg p-4 w-48 flex flex-col items-center hover:scale-105 transform transition-transform duration-300 hover:shadow-2xl hover:cursor-pointer'>
          <img src={book.imgSrc} alt={book.title} className='w-32 h-48 object-cover mb-4' />
          <h2 className='text-base font-semibold mb-2 h-14'>{book.title}</h2>
          <p className='text-gray-600'>{book.author}</p>
          <p className='text-sm text-gray-500 mt-1'>{book.category}</p>
          <p className='text-gray-800 font-bold mt-2'>{book.price}</p>
          <button
            className='mt-auto'
            onClick={() => handlePurchase(book)}
          >
            <span className='mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300'>
              Add to Cart
            </span>
          </button>
        </div>
      ))}
     </div>
    </div>
  );
}
