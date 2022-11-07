import Head from 'next/head'
import React from 'react'
import CreatePin from '../../components/CreatePin'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'

function CreatePinPage() {
  return (
    <Navigation>
      <Pins>
        <Head>
          <title>Buat pin untuk menyimpan kenangan anda hehe</title>
          <meta name="description" content="Kenangan adalah tempat kita untuk nostalgia dengan mencaci maki foto orang orang yang tidak konek wkwk" />
        </Head>
        <CreatePin />
      </Pins>
    </Navigation>
  )
}

export default CreatePinPage