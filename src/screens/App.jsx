import './App.css'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import Aside from '../components/Aside.jsx'
import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import NotFound from './NotFound.jsx'
import Myprofile from './Myprofile.jsx'
import { Outlet } from 'react-router-dom';




const url = "http://localhost:3001/"

function App() {



  // Render the main application UI
  return (
    <div id="container">
      <Header />
      <Navbar />
      <div className="main-layout">
        <Aside />
        <main>
          <Outlet /> 
        </main>
      </div>
    </div >
  )
  //<Route path="/signin" element={<Authentication authenticationMode={AuthenticationMode.SignIn} />} />
}

export default App
