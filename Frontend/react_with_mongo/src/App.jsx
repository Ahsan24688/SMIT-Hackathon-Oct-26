import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import AdminSetting from './components/adminsetting.jsx'

function App() {

  const [Isauthorizte, setIsauthorize] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsauthorize(true);
    } else {
      setIsauthorize(false);
    }
  }, [])


  return (
    <>
      <Routes>
        <Route path='/' element={Isauthorizte ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path='/register' element={Isauthorizte ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path='/login' element={Isauthorizte ? <Navigate to="/dashboard" /> : <Login setIsauthorize={setIsauthorize} />} />
        <Route path='/dashboard' element={Isauthorizte ? <Dashboard setIsauthorize={setIsauthorize} /> : <Navigate to="/login" />} />
        <Route path="/admin-settings" element={Isauthorizte ? <AdminSetting setIsauthorize={setIsauthorize} /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App
