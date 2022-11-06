import React from 'react'
import { Search } from '../../components'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'

function SearchPage() {
  return (
    <Navigation>
        <Pins>
            <Search />
        </Pins>
    </Navigation>
  )
}

export default SearchPage