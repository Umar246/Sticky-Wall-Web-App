import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NoPage from '../Frontend/NoPage'
import StickyWall from '../Frontend/StickyWall'
import Upcoming from '../Frontend/Upcoming'
import Calendar from '../Frontend/Calendar'
import Today from '../Frontend/Today'
import Other from './ListTodos/Other'
import Office from './ListTodos/Office'
import HomeTodos from './ListTodos/HomeTodos'
import Personal from './ListTodos/Personal'

export default function Index() {
    return (
        <>
       

            <Routes>

                <Route path='/' element={<StickyWall />} />
                <Route path='/upcoming' element={<Upcoming />} />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/today' element={<Today />} />
                <Route path='/list/other' element={<Other/>} />
                <Route path='/list/office' element={<Office/>} />
                <Route path='/list/homeTodos' element={<HomeTodos/>} />
                <Route path='/list/personal' element={<Personal/>} />
                <Route path='*' element={<NoPage />} />

            </Routes>
   
        </>
    )
}
