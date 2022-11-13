import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Image from 'next/legacy/image'
import bgLandscape from '../public/bg_landscape.jpg'
import bgPotrait from '../public/bg_potrait.jpg'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Loading from './Loading'

function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    return () => {
      setLoadingButton(false);
    }
  }, []);

  if(status === "loading"){
    return <Loading />
  }

  if(session?.error){
    router.push('/500');
    signOut();
  }

  if(session?.user || status === "authenticated"){
    router.push('/');
    return;
  }

  return (
    <section id="login" className="relative overflow-hidden">
      <div className="hidden sm:block absolute inset-0">
        <Image src={bgLandscape} objectFit="cover" layout="fill" priority />
      </div>
      <div className="block sm:hidden absolute inset-0">
        <Image src={bgPotrait} objectFit="cover" layout="fill" priority />
      </div>
      <div className="flex relative flex-col items-center justify-center h-screen bg-black bg-opacity-70 text-primary">
        <div className="container mb-8 sm:mb-10">
          <div className="text" style={{"--j": 0}}>
              <span style={{"--i": 0}}>F</span>
              <span style={{"--i": 1}}>H</span>
              <span style={{"--i": 2}}>W</span>
              <span style={{"--i": 3}}>M</span>
          </div>
          <div className="text" style={{"--j" :1}}>
              <span style={{"--i": 0}}>O</span>
              <span style={{"--i": 1}}>I</span>
              <span style={{"--i": 2}}>I</span>
              <span style={{"--i": 3}}>A</span>
          </div>
          <div className="text" style={{"--j" :2}}>
              <span style={{"--i": 0}}>R</span>
              <span style={{"--i": 1}}>.</span>
              <span style={{"--i": 2}}>D</span>
              <span style={{"--i": 3}}>T</span>
          </div>
          <div className="text" style={{"--j" :3}}>
              <span style={{"--i": 0}}>G</span>
              <span style={{"--i": 1}}>.</span>
              <span style={{"--i": 2}}>E</span>
              <span style={{"--i": 3}}>I</span>
          </div>
          <div className="text" style={{"--j" :1}}>
              <span style={{"--i": 0}}>E</span>
              <span style={{"--i": 1}}>.</span>
              <span style={{"--i": 2}}>R</span>
              <span style={{"--i": 3}}>C</span>
          </div>
          <div className="text" style={{"--j" :4}}>
              <span style={{"--i": 0}}>-</span>
              <span style={{"--i": 1}}>.</span>
              <span style={{"--i": 2}}>!</span>
              <span style={{"--i": 3}}>S</span>
          </div>
        </div>
        <div className="perspective flex flex-col justify-center items-center">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[40px]">Class A IF 2022</h1>
            <h2 className="text-xl md:text-3xl">Universitas Siliwangi</h2>
          </div>
          <div className="shadow-2xl">
            <button
            type="button"
            className={`${loadingButton ? 'px-4' : ''} bg-mainColor text-black flex justify-center items-center p-3 rounded-lg transition-all duration-200 cursor-pointer outline-none`}
            disabled={loadingButton}
            onClick={() => {
              setLoadingButton(true);
              signIn("google");
            }}
            >
              {loadingButton ? 'Loading...' : (
                <>
                  <FcGoogle className="mr-4" /> Sign in with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login