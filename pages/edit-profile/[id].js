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
import { organization_fields, socials_media } from '../../utils/data';

function CreatePin() {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [biodata, setBiodata] = useState('');
  const [organization_field, setOrganization_field] = useState('');
  const [social_media, setSocial_media] = useState({});
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [image_url, setImage_url] = useState('');
  const [cekImageStatus, setCekImageStatus] = useState(false);
  const [errorMessageCekImage, setErrorMessageCekImage] = useState('');

  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const handleCheckPhotoLink = (link) => {
    const image_url = /^(http:\/\/|https:\/\/)/gi.test(link);
    if(!image_url){
      setErrorMessageCekImage('Silahkan masukan input dengan benar!');
      return
    }
    setCekImageStatus(true);
    setErrorMessageCekImage(false);
  }

  const savePin = () => {
    const isValid = username && biodata && organization_field && image_url && typeof errorMessageCekImage === "boolean";

    let socialMediaArray = [];
    for(let title in social_media){
      social_media[title] !== '' && socialMediaArray.push({title: title, username: social_media[title], user_id: userData?._id});
    }

    console.log(socialMediaArray);

    // if(isValid){
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

    //     return;
    // }

    // setFields(true);

    // setTimeout(() => {
    //   setFields(false);
    // }, 4000);
  }

  useEffect(() => {
    if(user?.role === 'user'){
      router.push('/');
    }
  }, [user]);

  return (
    <Navigation>
        <div className="flex flex-col justify-center items-center p-2 bg-gray-50 min-h-screen">
            <div className="flex lg:flex-row flex-col justify-center items-center lg:items-start bg-white lg:p-5 p-3 lg:w-4/5 w-full">
                <div className="flex flex-col sm:flex-row lg:flex-col flex-0.7 w-full gap-4">
                  <div className="flex-1 bg-secondaryColor p-1 sm:p-3 w-[200px] sm:w-full mx-auto">
                      <div className="relative flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full aspect-square">
                          {cekImageStatus && (
                          <div className="text-center">
                              <Spinner message="Wait a minutes..." />
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
                              <p className="text-red-500 text-center text-sm sm:text-base">{errorMessageCekImage}</p>
                          )}
                      </div>
                  </div>
                  <div className="flex flex-col flex-[2] self-end lg:self-start w-full">
                    <input
                    type="text"
                    value={image_url}
                    onChange={e => {
                        setImage_url(e.target.value);
                        handleCheckPhotoLink(e.target.value);
                    }}
                    placeholder="Link poto profil"
                    className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />
                    <input
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Nama lengkap"
                    className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 lg:mt-0 w-full">
                    <textarea
                    type="text"
                    placeholder="Biodata"
                    onChange={e => setBiodata(e.target.value)}
                    className="outline-none text-base sm:text-lg border-2 border-gray-200 p-2 h-[200px] sm:h-[300px]"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      {socials_media.map((social, index) => (
                        <input
                        key={index}
                        type={social.name === 'whatsapp' ? 'number' : 'text'}
                        onChange={e => setSocial_media(prev => ({...prev, [social.name]: e.target.value}))}
                        name={social.name}
                        placeholder={social.placeholder}
                        className="outline-none text-base sm:text-lg border-2 rounded-md border-gray-200 p-2"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm italic"><sup>*</sup>Catatan: </p>
                      <p className="text-sm italic"># Input username harus tanpa @ dan spasi (Contoh: AamHermansyah).</p>
                      <p className="text-sm italic"># Untuk sosial media tidak wajib diisi (optional).</p>
                    </div>
                    <div className="flex flex-col">
                    <div>
                        <p className="mb-2 font-semibold text-lg sm:text-xl">Jabatan dikelas</p>
                        <select
                        onChange={e => setOrganization_field(e.target.value)}
                        className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-4 cursor-pointer"
                        >
                          <option value="Anggota" className="bg-white">Pilih jabatan</option>
                          {organization_fields.map((field, index) => (
                            <option key={index} className="p-2 text-base border-0 outline-none bg-white capitalize text-black">
                              {field}
                            </option>
                          ))}
                        </select>
                      </div>
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