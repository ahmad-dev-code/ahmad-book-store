import React from 'react'

export default function Contact() {
  return (
    <div className='bg-gray-200 text-black h-screen w-screen'>
      <h2 className=' text-2xl font-bold text-center pt-20'>Contact Ahmad's Book Store</h2>
      <p className=' text-left mt-10 mx-4 sm:mx-20 text-lg'>
        We would love to hear from you! Whether you have questions about our book selection, need assistance with an order, or just want to share your thoughts, feel free to reach out.
      </p>
      <ul className='text-left mt-6 mx-4 sm:mx-20 text-lg list-disc list-inside'>
        <li>Email: 22230512@students.liu.edu.lb</li>
        <li>Phone: +961 70 599 321</li>
        <li>Address: 123 Book St, Zahle, Lebanon</li>
      </ul>
      <p className=' text-left mt-10 mx-4 sm:mx-20 text-lg'>
        Our customer service team is available Monday to Friday, from 9 AM to 6 PM. We aim to respond to all inquiries within 24-48 hours.
      </p>
    </div>
  )
}
