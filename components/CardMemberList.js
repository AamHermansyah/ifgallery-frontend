import Image from 'next/legacy/image'
import React from 'react'

function CardMemberList({user, banner_url, skeleton}) {
    return (
        <div className={`${skeleton ? 'animate-pulse' : ''} w-[250px] h-[300px] border-4 border-white flex flex-col items-center bg-white shadow-xl rounded-md`}>
            <div className="relative bg-[#FFD7AE] h-[100px] w-full overflow-hidden" >
                {!skeleton && (
                    <Image src={`/api/imageproxy?url=${encodeURIComponent(banner_url)}`} alt="banner" layout="fill" objectFit="cover" />
                )}
            </div>
            <div className="relative w-20 h-20 -mt-10 rounded-full border-white border-4 bg-[#9AD9FF] shadow-md overflow-hidden">
                {!skeleton && (
                    <Image src={`/api/imageproxy?url=${encodeURIComponent(user?.image_url)}`} alt="member list" layout="fill" objectFit="cover" />
                )}
            </div>
            <p className={`${skeleton ? 'bg-gray-300 w-[100px] h-[10px] rounded-full' : ''} font-bold text-xl text-gray-700 mt-8 p-4 text-center`}>
                {!skeleton && user.username.replace(/\d/gi, '')}
            </p>
        </div>
    )
}

export default CardMemberList