import React, { useEffect, useState } from 'react'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'
import { AiOutlineLogout } from 'react-icons/ai'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import MasonryLayout from '../../components/MasonryLayout'
import Spinner from '../../components/Spinner'
import { client } from '../../client'
import { userQuery } from '../../utils/data'
import Image from 'next/legacy/image'
import bannerProfileLandscape from '../../public/banner-profile-landscape.jpg'
import bannerProfilePotrait from '../../public/banner-profile-potrait.jpg'

function Profile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  // useEffect(() => {
  //   const query = userQuery(id);

  //   client.fetch(query)
  //   .then(data => {
  //     setUser(data[0]);
  //   })
  //   .catch(err => {
  //     router.push('/404');
  //   })
  // }, []);

  return (
    <Navigation>
      <Pins>
        {user && (
          <Spinner message="Wait a minutes... Who are you?" />
        )}
        {!user && (
          <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
              <div className="relative flex flex-col mb-7">
                <div className="flex flex-col justify-center items-center">
                  <div className="hidden sm:block relative w-full h-370 2xl:h-510 shadow-lg">
                    <Image src={bannerProfileLandscape}
                    layout="fill"
                    objectFit="cover"
                    alt="banner-profile"
                    objectPosition="center"
                    priority
                    />
                  </div>
                  <div className="block sm:hidden relative w-full h-370 2xl:h-510 shadow-lg">
                    <Image src={bannerProfilePotrait}
                    layout="fill"
                    objectFit="cover"
                    alt="banner-profile"
                    objectPosition="center"
                    priority
                    />
                  </div>
                  <div className="relative w-20 h-20 border-4 bg-white border-white rounded-full -mt-10 shadow-xl overflow-hidden">
                    <Image src={bannerProfileLandscape}
                    layout="fill"
                    objectFit="cover"
                    alt="user picture"
                    objectPosition="center"
                    />
                  </div>
                  <h1 className="font-bold text-3xl text-center mt-3">
                    Aam Hermansyah
                  </h1>
                  <div className="absolute top-0 z-1 right-0 p-2">
                      <button className="bg-red-500 font-bold flex gap-2 items-center text-white p-2 px-5 shadow-md outline-none rounded-full">
                        Logout
                        <AiOutlineLogout fontSize={21} />
                      </button>
                  </div>
                  {session.user.userId === user?._id && (
                    <div className="absolute top-0 z-1 right-0 p-2">
                        <button className="bg-red-500 font-bold flex gap-2 items-center text-white p-2 px-5 shadow-md outline-none rounded-full">
                          Logout
                          <AiOutlineLogout fontSize={21} />
                        </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Pins>
    </Navigation>
  )
}

export default Profile