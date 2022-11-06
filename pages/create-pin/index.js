import React from 'react'
import CreatePin from '../../components/CreatePin'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'

function CreatePinPage() {
  return (
    <Navigation>
        <Pins>
            <CreatePin />
        </Pins>
    </Navigation>
  )
}

export default CreatePinPage