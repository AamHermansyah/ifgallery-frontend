import { useSession } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { client } from '../../client';
import { Spinner } from '../../components';
import Navigation from '../../container/Navigation'
import Pins from '../../container/Pins'
import { categories, pinDetailEditQuery } from '../../utils/data';
import { handleGDImageId } from '../../utils/handleGDImageUrl';
import { truncateName } from '../../utils/truncateString';

function editPinPage() {
    const [pin, setPin] = useState({
        title: '',
        about: '',
        destination: '',
        image_url: '',
        category: ''
    })
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(null);
    const [cekImageStatus, setCekImageStatus] = useState(false);
    const [errorMessageCekImage, setErrorMessageCekImage] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const { title, about, destination, image_url, category } = pin;

    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const { id } = router.query;

    const handleCheckPhotoLink = (link) => {
        const image_url = handleGDImageId(link);
        if(!image_url){
          setErrorMessageCekImage('Silahkan masukan input dengan benar!');
          return
        }

        setPin(prev => ({ ...prev, image_url }));
        setCekImageStatus(true);
        setErrorMessageCekImage(false);
    }

    const editPin = () => {
        const isValid = title && about &&  destination &&  image_url && category && typeof errorMessageCekImage === "boolean";
        if(isValid){
          setLoading(true);
    
            client
                .patch(pin._id)
                .set({ title, about, image_url, destination, category})
                .commit()
                .then(() => {
                    router.push('/pin-detail/' + pin._id);
                })
                .catch(err => {
                    router.push('/500');
                })
                .finally(() => {
                    setLoading(false);
                })
    
            return;
        }
    
        setFields(true);
    
        setTimeout(() => {
          setFields(false);
        }, 4000);
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        let queryFetch = pinDetailEditQuery(id);
        if(queryFetch && user){
            if(user.role === 'admin'){
                client.fetch(queryFetch, { signal })
                .then(data => {
                    if(data[0]){
                        if(data[0].posted_by._id === user.userId) setPin(data[0]);
                        else router.push('/');
                    } else router.push('/404');
                })
                .catch(err => {
                    if(err.name === "AbortError") return;
                    router.push('/500');
                })
                .finally(() => {
                    setFetchLoading(false);
                })
            } else router.push('/');
        }

        return () => {
            controller.abort();
        }
    }, [id, user]);
    
    return (
        <>
            <Head>
                <title>Edit pin anda | Forgematics A</title>
            </Head>
            <Navigation>
                <Pins>
                    {fetchLoading && (
                        <Spinner message="Wait a minutes! Who are you?" />
                    )}

                    {!fetchLoading && pin?._id && (
                        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
                            <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
                                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
                                    <div className="relative flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-[300px] sm:h-420">
                                        {cekImageStatus && (
                                        <div className="text-center">
                                            <Spinner message="Wait... Orang sabar disayang si dia ygy:v" />
                                        </div>
                                        )}

                                        {typeof errorMessageCekImage === 'boolean' ? (
                                        <Image 
                                        src={`/api/imageproxy?url=${encodeURIComponent(image_url)}`} 
                                        alt="Pin photo" 
                                        layout="fill" 
                                        objectFit="contain" 
                                        onError={e => setErrorMessageCekImage('Link error gambar tidak bisa dimuat:(')}
                                        onLoad={e => setCekImageStatus(false)}
                                        />
                                        ) : (
                                            <p className="text-red-500 text-center text-base sm:text-lg">{errorMessageCekImage}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                                    <input
                                    type="text"
                                    value={destination}
                                    onChange={e => {
                                        setPin(prev => ({ ...prev, destination: e.target.value  }));
                                        handleCheckPhotoLink(e.target.value);
                                    }}
                                    placeholder="Silahkan paste link poto dari google drive"
                                    className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                                    />
                                    <input
                                    type="text"
                                    value={title}
                                    onChange={e => setPin(prev => ({ ...prev, title: e.target.value  }))}
                                    placeholder="Judul poto pin mu"
                                    className="outline-none text-xl sm:text-2xl font-extrabold border-b-2 border-gray-200 p-2"
                                    />
                                    {user && (
                                        <div className="p-2 m-2 flex items-center">
                                        <div className="bg-gradient-to-tr from-pink-500 to-blue-600 p-0.5 flex items-center justify-center w-10 h-10 relative rounded-full">
                                            <div className="relative w-full h-full overflow-hidden rounded-full">
                                                <Image src={`/api/imageproxy?url=${encodeURIComponent(pin?.posted_by?.image_url)}`} alt="my-profile" layout="fill" objectFit="cover"/>
                                            </div>
                                        </div>
                                        <p className="ml-2 font-bold">{truncateName(pin?.posted_by?.username)}</p>
                                        </div>
                                    )}
                                    <input
                                    type="text"
                                    value={about}
                                    onChange={e => setPin(prev => ({ ...prev, about: e.target.value  }))}
                                    placeholder="Deskripsikan dong poto pin kece mu itu hehe"
                                    className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                                    />
                                    <div className="flex flex-col">
                                        <div>
                                            <p className="mb-2 font-semibold text-lg sm:text-xl">Pilih kategori</p>
                                            <select
                                            onChange={e => setPin(prev => ({ ...prev, category: e.target.value  }))}
                                            className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-4 cursor-pointer"
                                            defaultValue={category}
                                            >
                                                {categories.map((data, index) => (
                                                    <option key={index} className="p-2 text-base border-0 outline-none bg-white capitalize text-black">
                                                        {data.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="mt-3 text-sm italic"><sup>*</sup>Catatan: Jika data ketika di edit dan data belum berubah, itu karena delay dari server selama 1 menit.</p>
                                        {fields && (
                                            <p className="text-red-500 mt-3 text-md sm:text-xl transition-all duration-150 ease-in">Jangan buta map ya, harap diisi inputnya:(</p>
                                        )}
                                        <div className="flex justify-end items-end pb-6">
                                            <button
                                            type="button"
                                            onClick={editPin}
                                            className="bg-gradient-to-tr from-pink-500 to-purple-700 text-white mt-3 font-bold p-2 rounded-full w-28 outline-none"
                                            disabled={loading}>
                                                {loading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" fontSize={23} /> : 'Save Edit'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Pins>
            </Navigation>
        </>
    )
}

export default editPinPage