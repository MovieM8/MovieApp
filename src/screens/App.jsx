import './App.css'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import NotFound from './NotFound.jsx'




const url = "http://localhost:3001/"

function App() {



// Render the main application UI
return (
  <div id="container">
    <Header />
    <Navbar />
    
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/*" exact element={<NotFound />} />
    </Routes>

  </div>
)
//<Route path="/signin" element={<Authentication authenticationMode={AuthenticationMode.SignIn} />} />
}

export default App
