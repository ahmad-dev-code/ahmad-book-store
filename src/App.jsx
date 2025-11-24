import './App.css'
import { Routes, Route  } from 'react-router-dom';
import Header from './components/Header'
import About from './components/About'
import Contact from './components/Contact'
import Books from './components/Books'
import Home from './components/Home';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';



function App() {



  return (
    <div className=' h-screen w-screen'>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/books/:category?' element={<Books/>}/>
          <Route path='/shopping-cart' element={<ShoppingCart/>}/>
        </Routes>
        <Footer/>

    </div>
  )
}

export default App
