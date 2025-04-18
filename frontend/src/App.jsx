import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';


function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/fundraisers' element={<h1>Fundraisers Page</h1>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
  )
}

export default App
