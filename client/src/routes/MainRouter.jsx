import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../pages/Auth'
import Chat from '../pages/Chat'

function MainRouter() {
  return (
    <Routes>
        <Route path='/' element={<Auth />}></Route>
        <Route path='/chat' element={<Chat />}></Route>
     
    </Routes>
  )
}

export default MainRouter