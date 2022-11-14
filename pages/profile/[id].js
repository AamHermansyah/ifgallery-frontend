import React, { useEffect, useState } from 'react'
import Navigation from '../../container/Navigation'
import { AiOutlineEdit, AiOutlineLogout } from 'react-icons/ai'
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
import Link from 'next/link'
import { url } from '../../utils/config'
import { icons } from '../../components/icons'
import { addPins } from '../../app/features/pins/pinsSlice'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-24 outline-none';
const notActiveBtnStyles = 'bg-primary text-black font-bold p-2 rounded-full w-24 outline-none border-2 border-gray-600';

function Profile() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  // redux
  const dispatch = useDispatch();
  const pins = useSelector(state => state.pins);

  const handleSignOut = () => {
    signOut({
      callbackUrl: window.location.origin
    });
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if(loading || id){
      const query = userQuery(id);

      client.fetch(query, { signal })
      .then(data => {
        setUser(data[0]);
      })
      .catch((err) => {
        if(err.name === "AbortError") return;
        router.push('/500');
      })
    }

    return () => {
      controller.abort();
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(addPins([]));
    if(user){
      setLoading(true);

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
    }

    return () => {
      controller.abort();
    }

  }, [id, text, user]);

  return (
    <Navigation>
      {user && (
        <Head>
          <title>{`${user.username} | Profile`}</title>
          <meta name="description" content="User profile | Lihat apa yang temanmu pin dan upload" />
        </Head>
      )}

      {!user && (
        <Spinner message="Wait a minutes... Who are you?" />
      )}

      {user && (
        <main className="flex flex-col items-center pb-10 bg-gray-50 md:px-4">
          <div className="w-full bg-gradient-to-tr from-violet-800 to-red-500 rounded-b-md overflow-hidden">
              <div className="relative w-full h-[300px] sm:h-370 2xl:h-510 shadow-lg">
                <div className="hidden sm:block">
                  <Image src={bannerProfileLandscape}
                  layout="fill"
                  objectFit="cover"
                  alt="banner-profile"
                  priority
                  className="opacity-50"
                  />
                </div>
                <div className="block sm:hidden">
                  <Image src={bannerProfilePotrait}
                  layout="fill"
                  objectFit="cover"
                  alt="banner-profile"
                  priority
                  className="opacity-50"
                  />
                </div>
              </div>

              {session?.user?.userId === user?._id && (
                <div className="absolute top-0 z-1 right-0 pb-4 sm:pb-0 p-2">
                    <button onClick={handleSignOut}
                    className="bg-white font-bold flex gap-2 items-center text-red-500 p-2 px-5 shadow-md outline-none rounded-full cursor-pointer">
                        Logout
                        <AiOutlineLogout fontSize={21} />
                    </button>
                </div>
              )}
          </div>
          <div className="relative flex items-center flex-col gap-6 -mt-10 sm:-mt-14 w-[90%] sm:w-[80%] bg-white rounded-lg pt-8 sm:pt-6 p-6 shadow-sm">
              <div className="absolute top-0 z-1 right-0 p-2">
                {session?.user?.userId === user?._id && (
                    <Link href={`${url}/edit-profile/${user._id}`}
                    className="bg-sky-500 text-[.7rem] sm:text-sm flex gap-2 items-center text-white py-1 sm:py-2 px-3 sm:px-5 shadow-md outline-none rounded-full">
                        <span>Edit Profile</span>
                        <AiOutlineEdit className="text-[.7rem] sm:text-base" />
                    </Link>
                )}
              </div>
              <div className="relative w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] bg-violet-400 rounded-xl overflow-hidden">
                  <Image src={`/api/imageproxy?url=${encodeURIComponent(user?.image_url)}`}
                  layout="fill"
                  objectFit="cover"
                  alt="banner-profile"
                  objectPosition="center"
                  priority
                  className="shadow-sm"/>
              </div>
              <div className="w-[80%] sm:w-full text-center">
                <p className="text-sky-500 text-xl md:text-2xl font-bold mb-1">{user?.organization_field ? user?.organization_field : 'Guest'}</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className={`${user?.surname ? '-mt-1' : ''} text-red-500 text-base sm:text-lg font-bold`}>
                   {user?.surname ? `${user?.surname}` : ''}
                </p>
                <p className="font-thin max-w-[500px] mx-auto mt-2" style={{whiteSpace: 'pre-line'}}>
                    {user?.biodata ? user?.biodata : 'Biodata masih kosong😥'}
                </p>
                <div className="flex gap-3 py-3 justify-center w-full">
                    {user?.social_media?.length > 0 && user.social_media.map(social => (
                      <a href={`${icons[social.title].link}/${social.username}`} 
                      target="blank" 
                      rel="noreferrer"
                      className="relative w-[20px] h-[20px] sm:w-[27px] sm:h-[27px]"
                      key={social._key}>
                        <Image 
                        src={icons[social.title].icon} 
                        layout="fill"
                        objectFit="cover"
                        alt="social media icon"
                        objectPosition="center"
                        className="shadow-sm" />
                    </a>
                    ))}
                </div>
              </div>
          </div>
        </main>
      )}
      <div className="text-center bg-gray-50">
        <button 
        type="button"
        onClick={e => {
            setLoading(true);
            setText(e.target.textContent);
            setActiveBtn('created');
        }}
        className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles} cursor-pointer`}>
        Created
        </button>
        
        <button 
        type="button"
        onClick={e => {
            setLoading(true);
            setText(e.target.textContent);
            setActiveBtn('saved');
        }}
        className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles} ml-4 cursor-pointer`}>
            Saved
        </button>
      </div>
      {pins?.length ? (
          <div className="bg-gray-50 w-full p-4">
            <MasonryLayout pins={pins} />
          </div> ) : (
          <div className="bg-gray-50 flex justify-center font-bold items-center w-full text-xl py-4 sm:py-8 text-gray-800">
            {loading ? (
                <div className="animate-pulse" >Wait a minutes... Who are you?</div>
          ) : `Masih kosong kek hatinya:(`}
        </div>
      )}
    </Navigation>
  )
}

export default Profile