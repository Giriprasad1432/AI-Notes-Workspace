import Login from './login.jsx'
import Register from './register.jsx'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
