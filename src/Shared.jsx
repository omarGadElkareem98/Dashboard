import React from 'react'
import { Outlet } from 'react-router-dom'
import Menu from './components/Menu'
import './Shared.css'

export default function SharedOutlet() {
  return (
    <div className='menu-flex'>
        <Menu />

        <Outlet />
    </div>
  )
}
