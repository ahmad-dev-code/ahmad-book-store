import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <div className=' text-black flex justify-around p-4 text-xl shadow-md bg-white  '>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/books'>Books</Link>
            <Link to='/contact'>Contact</Link>
        </div>
    )
}
