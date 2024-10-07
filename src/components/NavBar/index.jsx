// src/components/Navbar/index.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '@/firebaseConfig'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const handleLogout = () => {
    auth.signOut()
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between">
        <li><Link to="/">Home</Link></li>
        <li><Button onClick={handleLogout}>Logout</Button></li>
      </ul>
    </nav>
  )
}

export default Navbar
