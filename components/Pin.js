import Image from 'next/legacy/image'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiOutlineLoading3Quarters, AiTwotoneDelete, AiTwotoneHeart } from 'react-icons/ai'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { client } from '../client';
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { truncateName } from '../utils/truncateString'
import { useDispatch, useSelector } from 'react-redux'
import { deletePin, replacePin } from '../app/features/pins/pinsSlice'
import { deletePinQuery, unsaveQuery } from '../utils/data'
import { url } from '../utils/config'

function Pin({pin, onDelete}) {
    const [imageSize, setSmageSize] = useState({
        width: 1,
        height: 1
       });
    const [cardActionDisplay, setCardActionDisplay] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const [unsavingPost, setUnsavingPost] = useState(false);
    const [alreadySaved, setAlreadySaved] = useState(false);

    const {data: session} = useSession();
    const { user } = session;

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        setAlreadySaved(!!(pin?.save?.filter(item => item.posted_by?._id === user.userId))?.length);
    }, []);

    const savePin = (id) => {
        if(!alreadySaved){
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    user_id: user.userId,
                    posted_by: {
                        _type: 'posted_by',
                        _ref: user.userId
                    }
                }])
                .commit()
                .then((data) => {
                    dispatch(replacePin(data));
                    setAlreadySaved(true);
                })
                .catch(err => {
                    router.push('/500');
                })
                .finally(() => {
                    setSavingPost(false);
                })
        }
    }

    const unsavePin = (pin) => {
        const key = pin.save.find(res => res.posted_by._id === user.userId)?._key;
        if(key){
            setUnsavingPost(true);
            const query = unsaveQuery(key);

            client
                .patch(pin._id)
                .unset(query)
                .commit()
                .then(data => {
                    dispatch(replacePin(data))
                    setAlreadySaved(false);
                })
                .catch(err => {
                    router.push('/500');
                })
                .finally(() => {
                    setUnsavingPost(false);
                });
        }
    }
          
    return (
        <div className="mt-2">
            <div
                onClick={() => router.push(`/pin-detail/${pin._id}`)}
                onMouseEnter={_ => setCardActionDisplay(true)}
                onMouseLeave={_ => setCardActionDisplay(false)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <Image
                    src={`/api/imageproxy?url=${encodeURIComponent(pin.image_url)}`}
                    layout="responsive"
                    objectFit="contain"
                    alt={pin.title}
                    loading="lazy"
                    onLoadingComplete={target => {
                    setSmageSize({
                        width: target.naturalWidth,
                        height: target.naturalHeight
                    });
                    }}
                    width={imageSize.width}
                    height={imageSize.height}
                    className="rounded-lg w-full"
                />
                <div
                className={`${cardActionDisplay ? 'flex' : 'hidden'} absolute inset-0 flex-col justify-between p-1 pr-2 py-2 z-50`}>
                    <div className="flex gap-2 justify-between">
                        <a
                        href={pin?.image_url?.replace('=view', '=download')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white h-9 w-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none hover:cursor-pointer"
                        onClick={e => e.stopPropagation()}
                        >
                            <MdDownloadForOffline />
                        </a>
                        <div className="bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none cursor-default">
                            {pin?.save ? pin?.save.length : '0'} Saved
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-2 w-full">
                        {pin?.image_url && (
                            <a
                            href={pin?.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md hover:cursor-pointer"
                            onClick={e => e.stopPropagation()}
                            >
                                <BsFillArrowRightCircleFill />
                                {pin.destination.length > 20 ? pin?.destination.slice(8, 20) : pin?.destination.slice(8)}
                            </a>
                        )}
                        <div className="flex gap-2 items-center flex-wrap">
                            {alreadySaved ? (
                                <button 
                                type="button" 
                                className="bg-white text-red-500 p-2 opacity-70 hover:opacity-100 font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer"
                                disabled={unsavingPost}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    unsavePin(pin);
                                }}>
                                    {unsavingPost ? (
                                        <div className="animate-spin">
                                            <AiOutlineLoading3Quarters />
                                        </div>
                                        ) : <AiTwotoneHeart />
                                    }
                                </button>
                                ) : (
                                <button 
                                type="button" 
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 p-2 opacity-70 hover:opacity-100 text-white font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer"
                                disabled={savingPost}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(pin._id)
                                }}>
                                    {savingPost ? (
                                        <div className="animate-spin">
                                            <AiOutlineLoading3Quarters />
                                        </div>
                                        ) : <AiTwotoneHeart />
                                    }
                                </button>
                            )}
                            
                            {pin?.posted_by._id === user.userId && (
                                <button 
                                type="button" 
                                className="bg-red-500 p-2 opacity-70 hover:opacity-100 text-white font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(pin._id);
                                }}>
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Link href={`${url}/profile/${pin?.posted_by._id}`} className="flex items-center mt-2 gap-2 mb-4">
                <div className="flex bg-gradient-to-tr from-pink-500 to-blue-600 p-0.5 items-center justify-center w-8 h-8 relative rounded-full">
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                        <Image src={`/api/imageproxy?url=${encodeURIComponent(pin?.posted_by.image_url)}`} alt="my-profile" layout="fill" objectFit="cover" />
                    </div>
                </div>
                <p className="font-semibold capitalize">
                    {truncateName(pin?.posted_by.username)}
                </p>
            </Link>
        </div>
    )
}

export default Pin