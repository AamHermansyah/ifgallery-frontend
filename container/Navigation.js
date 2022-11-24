import React, { useContext, useEffect, useState } from 'react'
import { Sidebar } from '../components'
import { HiMenu } from 'react-icons/hi'
import Link from 'next/link'
import Image from 'next/legacy/image'
import { NavigationContextApp } from '../context/navigationContext'
import { useSession } from 'next-auth/react'

import { Loading } from '../components'
import { MdClose } from 'react-icons/md'
import { url } from '../utils/config'

function Navigation({children}) {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const {data: session, status} = useSession();
    const navigationContext = useContext(NavigationContextApp);
    const {loadingScreen, setLoadingScreen} = navigationContext;

    useEffect(() => {
        if(status !== 'loading'){
            const timeout = setTimeout(() => {
                setLoadingScreen(false);
            }, 2000);

            return () => {
                clearTimeout(timeout);
                setLoadingScreen(true);
            }
        }
    }, [status]);

    if(status === 'loading' || loadingScreen){
        return <Loading />
    }
    
    const user = session?.user;

    return (
        <div className="bg-gray-50 flex flex-col md:flex-row h-screen transition-height duration-75 ease-out">
            <div className="hidden md:flex h-screen flex-initial">
                <Sidebar user={user}/>
            </div>
            <div className="flex md:hidden flex-row items-center justify-between py-2 px-4">
                <div className="flex items-center">
                    <HiMenu 
                    fontSize={40}
                    className="cursor-pointer"
                    onClick={() => setToggleSidebar(true)}
                    />
                    <Link href={url} className="text-xl text-blue-900 ml-4 font-extrabold outline-none">
                        Forgematics A
                    </Link>
                </div>
                {user && (
                     <Link href={`${url}/profile/${user.userId}`} className="bg-gradient-to-tr from-pink-500 to-blue-600 p-0.5 flex items-center justify-center w-12 h-12 relative rounded-full">
                        <div className="relative w-full h-full overflow-hidden rounded-full">
                            <Image src={`/api/imageproxy?url=${encodeURIComponent(user.image)}`} alt="my-profile" layout="fill" objectFit="cover" />
                        </div>
                    </Link>
                )}
            </div>
            {toggleSidebar && (
                <div className="fixed md:w-max w-4/5 h-screen overflow-y-auto shadow-md md:shadow-none z-10 animate-slide-in hide-scrollbar">
                    <Sidebar user={user} isNavbar={true} />
                    <div className="absolute top-0 w-full p-2 flex justify-end">
                        <MdClose 
                        fontSize={35}
                        className="cursor-pointer md:hidden"
                        onClick={() => setToggleSidebar(false)}
                        />
                    </div>
                </div>
            )}
        <div className="relative w-full">{children}</div>
    </div>
  )
}

export default Navigation