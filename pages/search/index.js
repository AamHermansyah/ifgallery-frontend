import Head from 'next/head'
import React from 'react'
import { Navbar, Search } from '../../components'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'

function SearchPage() {
  return (
    <Navigation>
        <Pins>
          <Head>
            <title>Temukan pin poto yang kamu ingin cari disini.</title>
            <meta name="description" content="Pencarian ini digunakan untuk mencari pin yang anda ingin temukan." />
          </Head>
          <div className="bg-gray-50">
            <Navbar />
          </div>
          <Search />
        </Pins>
    </Navigation>
  )
}

export default SearchPage