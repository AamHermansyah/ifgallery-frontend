import React from 'react'
import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components"
import { PinsContextWrapper } from '../context/PinsContext'

function Pins({children}) {
  return (
    <div className="w-full px-2 md:px-5">
      <PinsContextWrapper>
        <div className="bg-green-50">
          <Navbar />
        </div>
        <div>
          {children}
        </div>
      </PinsContextWrapper>
    </div>
  )
}

export default Pins