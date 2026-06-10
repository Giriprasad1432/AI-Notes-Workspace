import Login from './login.jsx'
import Register from './register.jsx'
import Navbar from './NavBar.jsx'
import Dashboard from './Dashboard.jsx'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute";

function App() {

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
