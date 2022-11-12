import { useSession } from 'next-auth/react'
import Image from 'next/legacy/image'
import Link from 'next/link';
import React from 'react'
import { AiOutlineEdit } from 'react-icons/ai';
import { url } from '../utils/config';
import { truncateName } from '../utils/truncateString';
import { icons } from './icons';

function CardMemberList({user}) {
    const { data: session } = useSession();

    return (
        <div className="relative p-4 flex gap-4 w-full sm:max-w-[350px] h-max bg-white rounded-lg sm:rounded-xl shadow-sm">
            <div className="absolute top-0 z-1 right-0 p-2">
                {session?.user?.userId === user?._id && (
                    <Link href={`${url}/edit-profile/${user._id}`}
                    className="bg-sky-500 text-[.7rem] flex gap-2 items-center text-white p-1 px-3 shadow-md outline-none rounded-full">
                        Edit Profile
                        <AiOutlineEdit fontSize={14} />
                    </Link>
                )}
            </div>

            <div className="flex-1">
                <Link href={`${url}/profile/${user._id}`} className="block w-[100px] h-[100px] relative rounded-lg overflow-hidden bg-violet-400">
                    <Image src={`/api/imageproxy?url=${encodeURIComponent(user?.image_url)}`}
                    layout="fill"
                    objectFit="cover"
                    alt="banner-profile"
                    objectPosition="center"
                    priority
                    className="shadow-sm"/>
                </Link>

                <div className={`${user?.social_media?.length > 0 ? 'mt-3' : ''} flex justify-center gap-2 flex-wrap w-[100px]`}>
                    {user?.social_media?.length > 0 && user.social_media.map(social => (
                        <a href={`${icons[social.title].link}/${social.username}`} 
                        target="blank" 
                        rel="noreferrer" 
                        className="relative w-[20px] h-[20px] transition-all duration-150"
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

            <div className="flex-[2.5] sm:flex-[2]">
                <p className="text-sky-500 text-md font-bold">
                    {user?.organization_field ? user?.organization_field : 'Guest'}
                </p>
                <Link href={`${url}/profile/${user._id}`} className="text-xl font-bold text-gray-800 capitalize leading-3">
                    {truncateName(user.username)}
                </Link>
                <p className={`${user?.surname ? 'mb-1 -mt-1' : ''} text-red-500 text-sm font-bold`}>
                   {user?.surname ? `a.k ${user?.surname}` : ''}
                </p>
                <p className="font-thin text-sm" style={{whiteSpace: 'pre-line'}}>
                    {user?.biodata ? user?.biodata : 'Biodata masih kosong😥'}
                </p>
            </div>
        </div>
    )
}

export default CardMemberList