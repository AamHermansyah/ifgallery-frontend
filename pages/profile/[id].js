import React, { useEffect, useState } from 'react'
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'
import { AiOutlineLogout } from 'react-icons/ai'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import MasonryLayout from '../../components/MasonryLayout'
import Spinner from '../../components/Spinner'
import { client } from '../../client'
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../../utils/data'
import Image from 'next/legacy/image'
import bannerProfileLandscape from '../../public/banner-profile-landscape.jpg'
import bannerProfilePotrait from '../../public/banner-profile-potrait.jpg'
import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { addPins } from '../../app/features/pins/pinsSlice'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-24 outline-none';
const notActiveBtnStyles = 'bg-primary text-black font-bold p-2 rounded-full w-24 outline-none';

function Profile() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // redux
  const dispatch = useDispatch();
  const pins = useSelector(state => state.pins);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    const query = userQuery(id);

    client.fetch(query, { signal })
    .then(data => {
      if(data[0]) setUser(data[0]);
      else router.push('/404');
    })
    .catch((err) => {
      if(err.name === "AbortError") return;
      router.push('/500');
    })

    return () => {
      controller.abort();
    }
  }, [id]);

  useEffect(() => {
    dispatch(addPins([]));

    const controller = new AbortController();
    const signal = controller.signal;

    if(text === 'Created'){
      const createdPinsQuery = userCreatedPinsQuery(id);

      client.fetch(createdPinsQuery, { signal })
      .then((data) => {
        dispatch(addPins(data));
      })
      .catch(err => {
        if(err.name === "AbortError") return;
        router.push('/500');
      })
      .finally(() => {
        setLoading(false);
      })

    } else {
      const savedPinsQuery = userSavedPinsQuery(id);

      client.fetch(savedPinsQuery, { signal })
      .then((data) => {
        dispatch(addPins(data));
      })
      .catch(err => {
        if(err.name === "AbortError") return;
        router.push('/500');
      })
      .finally(() => {
        setLoading(false);
      })

    }

    return () => {
      controller.abort();
    }
  }, [id, text]);

  return (
    <Navigation>
      <Pins>
        {user && (
          <Head>
            <title>{user ? user.username : 'View profile | Forgematics A'}</title>
            <meta name="description" content="User profile | Lihat apa yang temanmu pin dan upload" />
          </Head>
        )}

        {!user && (
          <Spinner message="Wait a minutes... Who are you?" />
        )}

        {user && (
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
                    <Image src={`/api/imageproxy?url=${encodeURIComponent(user?.image_url)}`}
                    layout="fill"
                    objectFit="cover"
                    alt="user picture"
                    objectPosition="center"
                    />
                  </div>
                  <h1 className="font-bold text-3xl text-center mt-3">
                    {user.username}
                  </h1>
                  {session?.user?.userId === user?._id && (
                    <div className="absolute top-0 z-1 right-0 p-2">
                        <button onClick={signOut}
                        className="bg-red-500 font-bold flex gap-2 items-center text-white p-2 px-5 shadow-md outline-none rounded-full">
                          Logout
                          <AiOutlineLogout fontSize={21} />
                        </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center mb-7">
                <button 
                type="button"
                onClick={e => {
                    setLoading(true);
                    setText(e.target.textContent);
                    setActiveBtn('created');
                  }}
                  className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles} cursor-pointer`}
                >
                  Created
                </button>
                <button 
                type="button"
                onClick={e => {
                    setLoading(true);
                    setText(e.target.textContent);
                    setActiveBtn('saved');
                  }}
                  className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles} ml-4 cursor-pointer`}
                >
                  Saved
                </button>
              </div>

              {pins?.length ? (
                <div className="px-2">
                    <MasonryLayout pins={pins} />
                </div>
              ) : (
                <div className="flex justify-center font-bold items-center w-full text-xl mt-2 text-gray-800">
                  {loading ? (
                    <div className="animate-pulse" >Wait a minutes... Who are you?</div>
                  ) : `Masih kosong kek hatinya:(`}
                </div>
              )}
            </div>
          </div>
        )}
      </Pins>
    </Navigation>
  )
}

export default Profile