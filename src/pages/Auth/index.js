import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import Signup from './Signup/Signup'
import NoPage from './NoPage/NoPage'

export default function index() {
  return (
    <>
    
    <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='*' element={<NoPage/>}/>
    </Routes>
    
    </>
  )
}
