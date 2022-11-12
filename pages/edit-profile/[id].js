import { useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { client } from '../../client';
import Spinner from '../../components/Spinner';
import Navigation from '../../container/Navigation';
import { organization_fields, socials_media, userQuery } from '../../utils/data';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import { handleGDImageId } from '../../utils/handleGDImageUrl';

function CreatePin() {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [biodata, setBiodata] = useState('');
  const [organization_field, setOrganization_field] = useState('');
  const [social_media, setSocial_media] = useState({});
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [image_url, setImage_url] = useState('');
  const [cekImageStatus, setCekImageStatus] = useState(true);
  const [errorMessageCekImage, setErrorMessageCekImage] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;
  const { id } = router.query;

  const handleCheckPhotoLink = (link) => {
    const image_url_from_gd = handleGDImageId(link);
    if(image_url_from_gd){
      setImage_url(image_url_from_gd);
      setCekImageStatus(true);
      setErrorMessageCekImage(false);
      return
    }

    const isValidImage_url = /^(http:\/\/|https:\/\/)/gi.test(link);
    if(!isValidImage_url){
      setImage_url(link);
      setCekImageStatus(false);
      setErrorMessageCekImage('Silahkan masukan input dengan benar!');
      return
    }

    setImage_url(link);
    setCekImageStatus(true);
    setErrorMessageCekImage(false);
  }

  const savePin = () => {
    const isValid = username && biodata && image_url && typeof errorMessageCekImage === "boolean";

    if(isValid && userData){
      setLoading(true);

      let socialMediaArray = [];
      for(let title in social_media){
        social_media[title]?.username !== '' 
        &&
        socialMediaArray.push({
          title: title, 
          username: title === "whatsapp" ? social_media[title].username.replace(/^(0|(?=8)|(\+62))/gi, '62') : social_media[title].username,
          user_id: userData?._id, 
          _key: uuidv4()
        });
      }

      let doc = { 
        username: username.trim(),
        biodata: biodata.trim(),
        organization_field: !organization_field ? 'Guest' : organization_field, biodata, 
        image_url ,
        social_media: socialMediaArray,
        surname
      }

      client
        .patch(userData._id)
        .set(doc)
        .commit()
        .then(() => {
          router.push('/profile/' + userData._id);
        })
        .catch(() => {
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

    if(user){
    const query = userQuery(id);
      client
        .fetch(query, { signal })
        .then(data => {
          if(data[0]){
            if(data[0]._id === user?.userId){
              setUserData(data[0]);
              setUsername(data[0].username);
              setBiodata(data[0].biodata);
              setOrganization_field(data[0].organization_field);
              setImage_url(data[0].image_url);
              data[0]?.surname && setSurname(data[0].surname);
              if(data[0].social_media){
                setSocial_media(data[0].social_media.reduce((initital, current) => ({
                  ...initital,
                  [current.title]: {
                    username: current.username,
                    user_id: current.user_id
                  }
                }), {}));
              }
            } else router.push('/');
          } else router.push('/404');
        })
        .catch(err => {
          if(err.name === "AbortError") return;
          router.push('/500');
        })
    }

    return () => {
      controller.abort();
    }
  }, [user, id]);

  return (
    <Navigation>
      <Head>
        <title>Edit profile kamu | Forgematics A 2022</title>
      </Head>
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
                    alt="Photo profile" 
                    layout="fill" 
                    objectFit="cover"
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
                  onChange={e => handleCheckPhotoLink(e.target.value)}
                  placeholder="Link poto profil"
                  className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                  />
                  <input
                  onChange={e => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Nama lengkap"
                  className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                  />
                  <input
                  onChange={e => setSurname(e.target.value)}
                  value={surname}
                  type="text"
                  placeholder="Julukan/A.K/Panggilan (optional)"
                  className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 lg:mt-0 w-full">
                <textarea
                type="text"
                placeholder="Biodata"
                onChange={e => setBiodata(e.target.value)}
                value={biodata ? biodata : ''}
                className="outline-none text-base sm:text-lg border-2 border-gray-200 p-2 h-[200px] sm:h-[300px]"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {socials_media.map((social, index) => (
                    <input
                    key={index}
                    type={social.name === 'whatsapp' ? 'number' : 'text'}
                    value={social_media[social.name] ? social_media[social.name].username : ''}
                    onChange={e => setSocial_media(prev => ({
                      ...prev,
                      [social.name]: {
                        username: e.target.value
                      }
                    }))}
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
                  <p className="text-sm italic"># Jika perubahan sudah disimpan dan tidak terjadi apa apa, silahkan tunggu 1 menit karena server delay.</p>
                </div>
                <div className="flex flex-col">
                  {userData?.role_user === "admin" && (
                    <div>
                      <p className="mb-2 font-semibold text-lg sm:text-xl">Jabatan dikelas</p>
                      <select
                      onChange={e => setOrganization_field(e.target.value)}
                      defaultValue={organization_field ? organization_field : 'Guest'}
                      className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-4 cursor-pointer"
                      >
                        <option value="Guest" className="bg-white">Pilih jabatan</option>
                        {organization_fields.map((field, index) => (
                          <option value={field} key={index} className="p-2 text-base border-0 outline-none bg-white capitalize text-black">
                            {field}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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