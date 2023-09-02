import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NoPage from '../Frontend/NoPage'
import StickyWall from '../Frontend/StickyWall'
import Upcoming from '../Frontend/Upcoming'
import Celendar from '../Frontend/Celendar'
import Today from '../Frontend/Today'
export default function Index() {
    return (
        <>
            <Routes>

                <Route path='/' element={<StickyWall />} />
                <Route path='/upcoming' element={<Upcoming />} />
                <Route path='/celendar' element={<Celendar />} />
                <Route path='/today' element={<Today />} />
                <Route path='*' element={<NoPage />} />

            </Routes>
        </>
    )
}
