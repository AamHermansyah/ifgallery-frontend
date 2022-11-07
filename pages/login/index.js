import Head from 'next/head'
import React from 'react'
import { Login } from '../../components'

function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Forgematics A 2022</title>
        <meta name="description" content="Silahkan untuk login terlebih dahulu sebelum anda melihat pin yang tersedia" />
      </Head>
      <Login />
    </>
  )
}

export default LoginPage