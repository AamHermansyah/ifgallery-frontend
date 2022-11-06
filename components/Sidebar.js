import Image from 'next/legacy/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { HiHome } from 'react-icons/hi'
import { NavigationContextApp } from '../context/navigationContext'
import { categories } from '../utils/data'
import { truncateName } from '../utils/truncateString'

function Sidebar({user}) {
  const {navigationActive, setNavigationActive} = useContext(NavigationContextApp);
  
  const isActive = "text-black font-extrabold border-r-2 border-black"
  const isNotActive = "text-gray-600 hover:text-black"

  return (
    <aside className="h-screen min-w-210 relative">
      <div className="flex flex-col justify-between bg-white overflow-y-scroll hide-scrollbar md:fixed md:inset-0">
        <div className="flex flex-col">
          <Link href="/" className="flex text-blue-900 px-5 gap-2 py-3 w-190 items-center text-xl font-extrabold">
            Forgematics A
          </Link>
          <div className="flex flex-col gap-5">
            <Link 
            href="/" 
            className={`${navigationActive === "home" ? isActive : isNotActive} flex items-center px-5 gap-3 transition-all duration-200 capitalize`}
            onClick={() => setNavigationActive("home")}
            >
              <HiHome />
              Home
            </Link>
            <h3 className="px-5 text-base 2xl:text-xl">Discover Categories</h3>
            {categories.map((category, index) => (
                <Link 
                href={`https://localhost:3000?categoryId=${category.name}`}
                className={`${navigationActive === category.name ? isActive : isNotActive} flex items-center px-5 gap-3 transition-all duration-200 capitalize`}
                onClick={() => setNavigationActive(category.name)}
                key={index}>
                  {category.icon}
                  {category.name}
                </Link>
            ))}
          </div>
        </div>
        {user && (
          <Link href={`user-profile/${user.userId}`} className="p-2 m-2 flex items-center">
            <div className="bg-gradient-to-tr from-pink-500 to-blue-600 p-0.5 flex items-center justify-center w-10 h-10 relative rounded-full">
              <div className="relative w-full h-full overflow-hidden rounded-full">
                  <Image src={`/api/imageproxy?url=${encodeURIComponent(user.image)}`} alt="my-profile" layout="fill" objectFit="cover" />
              </div>
            </div>
            <p className="ml-2">{truncateName(user.name)}</p>
          </Link>
        )}
      </div>
    </aside>
  )
}

export default Sidebar