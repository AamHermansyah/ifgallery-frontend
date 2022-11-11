import { useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { client } from '../../client';
import { handleGDImageId } from '../../utils/handleGDImageUrl';
import { truncateName } from '../../utils/truncateString';
import Spinner from '../../components/Spinner';
import Navigation from '../../container/Navigation';

function CreatePin() {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [image_url, setImage_url] = useState('');
  const [cekImageStatus, setCekImageStatus] = useState(false);
  const [errorMessageCekImage, setErrorMessageCekImage] = useState('');

  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const handleCheckPhotoLink = (link) => {
    const image_url = handleGDImageId(link);
    if(!image_url){
      setErrorMessageCekImage('Silahkan masukan input dengan benar!');
      return
    }
    setCekImageStatus(true);
    setErrorMessageCekImage(false);
  }

  const savePin = () => {
    const isValid = title && about && image_url && typeof errorMessageCekImage === "boolean";
    if(isValid){
    //   setLoading(true);
    //   const doc = {
    //     _type: 'pin',
    //     title,
    //     about,
    //     image_url,
    //     user_id: user.userId,
    //     posted_by: {
    //       _type: 'posted_by',
    //       _ref: user.userId
    //     }
    //   }

    //   client.create(doc)
    //     .then(() => {
    //       router.push('/profile/' + user.userId);
    //     })
    //     .catch(() => {
    //       router.push('/500');
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     })

        return;
    }

    setFields(true);

    setTimeout(() => {
      setFields(false);
    }, 4000);
  }

  const handleSocialMedia = (event) => {
    const isValid = /^(\w+|_|\-)\d*$/gi
    console.log(isValid.test(event.target.value));
  }

  useEffect(() => {
    if(user?.role === 'user'){
      router.push('/');
    }
  }, [user]);

  return (
    <Navigation>
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5 p-2 bg-gray-50">
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
                            /> ) : (
                            <p className="text-red-500 text-center text-base sm:text-lg">{errorMessageCekImage}</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                    <input
                    type="text"
                    value={image_url}
                    onChange={e => {
                        setImage_url(e.target.value);
                        handleCheckPhotoLink(e.target.value);
                    }}
                    placeholder="Link poto profil dari google drive"
                    className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />
                    <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />
                    <textarea
                    type="text"
                    placeholder="Biodata"
                    className="outline-none text-base sm:text-lg border-2 border-gray-200 p-2 h-[200px] sm:h-[300px]"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input
                        type="text"
                        onChange={handleSocialMedia}
                        placeholder="Username Facebook"
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                        <input
                        type="text"
                        placeholder="Username Github"
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                        <input
                        type="text"
                        placeholder="Username Instagram"
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                        <input
                        type="text"
                        placeholder="Username Telegram"
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                        <input
                        type="text"
                        placeholder="Username Twitter"
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                        <input
                        type="text"
                        placeholder="Nomor Whatsapp"
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                    </div>
                    <p className="mt-3 text-sm italic"><sup>*</sup>Catatan: Input username harus tanpa @ dan spasi (Contoh: AamHermansyah).</p>
                    <div className="flex flex-col">
                        {fields && (
                            <p className="text-red-500 mt-3 text-md sm:text-xl transition-all duration-150 ease-in">Jangan buta map ya, harap diisi inputnya:(</p>
                        )}
                        <div className="flex justify-end items-end pb-6">
                            <button
                            type="button"
                            onClick={savePin}
                            className="bg-gradient-to-tr from-pink-500 to-purple-700 text-white mt-3 font-bold p-2 rounded-full w-28 outline-none"
                            disabled={loading}>
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" fontSize={23} /> : 'Save Edit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Navigation>
  )
}

export default CreatePin