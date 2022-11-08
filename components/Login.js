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
    setLoadingButton(false);
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
    <section id="login" className="relative">
      <div className="hidden sm:block absolute inset-0">
        <Image src={bgLandscape} objectFit="cover" layout="fill" priority />
      </div>
      <div className="block sm:hidden absolute inset-0">
        <Image src={bgPotrait} objectFit="cover" layout="fill" priority />
      </div>
      <div className="flex flex-col justify-center items-center h-screen relative bg-black bg-opacity-70 text-primary">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-[40px]">Class A IF 2022</h1>
          <h2 className="text-xl md:text-3xl">Universitas Siliwangi</h2>
        </div>
        <div className="shadow-2xl">
          <button
          type="button"
          className={`${loadingButton ? 'px-4' : ''} bg-mainColor text-black flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none`}
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
    </section>
  )
}

export default Login