import React from 'react'
import { Navbar, Search } from '../../components'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'

function SearchPage() {
  return (
    <Navigation>
        <Pins>
          <div className="bg-gray-50">
            <Navbar />
          </div>
          <Search />
        </Pins>
    </Navigation>
  )
}

export default SearchPage