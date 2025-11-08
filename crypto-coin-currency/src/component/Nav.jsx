import React from 'react'
// importing img
import image from '../images/Gocoin-photo.png'

const Nav = () => {
  return (
    <div>
    {/* Logo */}
      <img  style={{height:"90px",width:"90px",marginLeft:"4%"}}src={image} alt="" />
      <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 text-center">GO-COIN</h1>
      <marquee><strong><p>Your daily coin investment platform</p></strong></marquee>
    </div>
  )
}

export default Nav