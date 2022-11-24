import Image from 'next/legacy/image'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { HiHome } from 'react-icons/hi'
import { NavigationContextApp } from '../context/navigationContext'
import { categories } from '../utils/data'
import { truncateName } from '../utils/truncateString'
import { useRouter } from 'next/router';
import { url } from '../utils/config'
import { MdGroups } from 'react-icons/md'
import { SiGoogleclassroom } from 'react-icons/si'

function Sidebar({user, isNavbar}) {
  const {navigationActive, setNavigationActive} = useContext(NavigationContextApp);
  const router = useRouter();
  const { categoryId } = router.query;

  const isActive = "text-black font-extrabold border-r-2 border-black"
  const isNotActive = "text-gray-600 hover:text-black"

  useEffect(() => {
    switch(router.pathname){
      case '/':
        categoryId && setNavigationActive(categoryId);
        !categoryId && setNavigationActive('home');
        break;
      case '/member-list':
        setNavigationActive('member-list')
        break
      case '/meetings':
      case '/meetings/[id]':
        setNavigationActive('meetings')
        break
      default:
        setNavigationActive('home');
        break
    }
  }, [categoryId, router.pathname])

  return (
    <aside className="h-screen min-w-210 relative">
      <div className={`${!isNavbar ? 'fixed w-full md:w-[210px]' : ''} min-h-full pl-4 pb-4 flex flex-col bg-white overflow-y-scroll hide-scrollbar`}>
        <div className="flex flex-col">
          <Link href="/" className="flex text-blue-900 gap-2 py-3 w-190 items-center text-xl font-extrabold">
            Forgematics A
          </Link>
          <div className="flex flex-col gap-5">
            <Link 
            href="/"
            className={`${navigationActive === "home" ? isActive : isNotActive} flex items-center gap-3 transition-all duration-200 capitalize`}>
              <HiHome />
              Home
            </Link>
            <Link 
            href="/member-list" 
            className={`${navigationActive === "member-list" ? isActive : isNotActive} flex items-center gap-3 transition-all duration-200 capitalize`}>
              <MdGroups />
              Member List
            </Link>
            <Link 
            href="/meetings" 
            className={`${navigationActive === "meetings" ? isActive : isNotActive} flex items-center gap-3 transition-all duration-200 capitalize`}>
              <SiGoogleclassroom />
              Pertemuan
            </Link>
            <h3 className="text-base 2xl:text-xl">Discover Categories</h3>
            {categories.map((category, index) => (
                <Link 
                href={`${url}/?categoryId=${category.name}`}
                className={`${navigationActive === category.name ? isActive : isNotActive} flex items-center gap-3 transition-all duration-200 capitalize`}
                key={index}>
                  {category.icon}
                  {category.name}
                </Link>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {user ? (
            <Link href={`${url}/profile/${user.userId}`} className="flex items-center my-4">
              <div className="bg-gradient-to-tr from-pink-500 to-blue-600 p-0.5 flex items-center justify-center w-10 h-10 relative rounded-full">
                <div className="relative w-full h-full overflow-hidden rounded-full">
                    <Image src={`/api/imageproxy?url=${encodeURIComponent(user.image)}`} alt="my-profile" layout="fill" objectFit="cover" />
                </div>
              </div>
              <p className="ml-2 capitalize">{truncateName(user.name)}</p>
            </Link>
          ) : (
            <Link href={`${url}/login`} className="max-w-[180px] py-2 opacity-100 hover:shadow-md hover:opacity-80 flex bg-gradient-to-tr from-pink-500 to-blue-600 text-white font-bold shadow-md rounded-lg justify-center items-center transition-all duration-200">
                Login
            </Link>
          )}
          
          {user?.role === 'admin' && (
            <Link href={`${url}/create-pin`} className="max-w-[180px] py-2 opacity-100 hover:shadow-md hover:opacity-80 flex md:hidden bg-gradient-to-tr from-pink-500 to-blue-600 text-white font-bold shadow-md rounded-lg justify-center items-center transition-all duration-200">
                Buat Pin
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar