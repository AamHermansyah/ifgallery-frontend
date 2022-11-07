import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { MdDownloadForOffline, MdOutlineAutoDelete } from 'react-icons/md'
import { GrSend } from 'react-icons/gr'
import { v4 as uuidv4 } from 'uuid'
import { client } from '../../client';
import Spinner from '../../components/Spinner';
import Navigation from '../../container/Navigation';
import Pins from '../../container/Pins';
import { deleteCommentQuery, pinDetailMorePinQuery, pinDetailQuery, unsaveQuery } from '../../utils/data';
import { truncateName } from '../../utils/truncateString';
import { AiOutlineLoading3Quarters, AiTwotoneHeart } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import MasonryLayout from '../../components/MasonryLayout';
import { getDateWithDayName, getHoursAndMinutes } from '../../utils/formatDate';

function PinDetail() {
  const [acpectImageType, setAcpectImageType] = useState('square');
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorCommentDisplay, setErrorCommentDisplay] = useState(false);

  // save and unsaving state
  const [savingPost, setSavingPost] = useState(false);
  const [unsavingPost, setUnsavingPost] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  // delete state
  const [alertDeleteDisplay, setAlertDeleteDisplay] = useState(false);
  const [idCommentForDelete, setIdCommentForDelete] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const user = session?.user;

  const fetchPinDetail = () => {
    let queryFetch = pinDetailQuery(id);
    if(queryFetch){
      client.fetch(queryFetch)
      .then(data => {
        setPinDetail(data[0]);

        if(data[0]){
          queryFetch = pinDetailMorePinQuery(data[0]);

          client
          .fetch(queryFetch)
          .then(res => {
            setPins(res);
          })
        } 
        else router.push('/404');
      })
      .catch(err => {
        router.push('/500');
      })
      .finally(() => {
        setLoading(false);
      })
    }
  }

  useEffect(() => {
    if(user){
      fetchPinDetail();
    }
  }, [user, id]);

  useEffect(() => {
    if(pinDetail){
      setAlreadySaved(!!(pinDetail?.save?.filter(item => item.posted_by?._id === user.userId))?.length);
    }
  }, [pinDetail])

  // save pin
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
              setPinDetail(prev => ({
                ...prev,
                save: [
                  ...prev.save,
                  {
                    _key: data.save.find(item => item.user_id === user.userId)._key,
                    user_id: user.userId,
                    posted_by: {
                      _id: user.userId,
                      username: user.name,
                      image_url: user.image
                    }
                  }
                ]
              }));
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

  // unsaving pin
  const unsavePin = (pin) => {
    const key = pin.save.find(res => res.posted_by._id === user.userId)?._key;
    if(key){
        setUnsavingPost(true);
        const query = unsaveQuery(key);

        client
            .patch(pin._id)
            .unset(query)
            .commit()
            .then(() => {
              setPinDetail(prev => ({
                ...prev,
                save: prev.save.filter(item => item._key !== key)
              }));
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

  // add comment
  const handleAddComment = () => {
    if(comment.length < 3) {
      setErrorCommentDisplay(true);
      return;
    };

    const date = `${getHoursAndMinutes(new Date())} ${getDateWithDayName(new Date())}`;

    setAddingComment(true);
    client
      .patch(id)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [{
        create_at: date,
        comment,
        _key: uuidv4(),
        posted_by: {
          _type: 'posted_by',
          _ref: user.userId
        }
      }])
      .commit()
      .then(() => {
        setPinDetail(prev => ({
          ...prev,
          comments: [
            ...prev.comments,
            {
              comment,
              create_at: date,
              posted_by: {
                _id: user.userId,
                username: user.name,
                image_url: user.image
              }
            }
          ]
        }))
        setComment('');
      })
      .catch(err => {
        router.push('/500')
      })
      .finally(() => {
        setAddingComment(false);
      })
  }

  // delete comment
  const handleDeleteComment = (key) => {
    setDeletingPost(true);
    const query = deleteCommentQuery(key);

    client
        .patch(pinDetail._id)
        .unset(query)
        .commit()
        .then(data => {
          setPinDetail(prev => ({
            ...prev,
            comments: prev.comments.filter(comment => comment._key !== key)
          }))
        })
        .catch(err => {
            router.push('/500');
        })
        .finally(() => {
          setDeletingPost(false);
          setIdCommentForDelete(null);
          setAlertDeleteDisplay(false);
        });
  }

  return (
    <Navigation>
      <Pins>
        {loading && (
          <div className="p-4">
            <Spinner message="Sabar ya ini masih loading..." />
          </div>
        )}

      {alertDeleteDisplay && (
        <div id="alert-delete" className="fixed inset-0 flex items-center justify-center z-[100] bg-white bg-opacity-70 backdrop-blur-sm">
          <div className="shadow-lg rounded-2xl p-4 bg-white w-64 sm:w-[300px] m-auto">
            <div className="w-full h-full text-center my-3">
              <div className="flex h-full flex-col justify-between">
                <MdOutlineAutoDelete fontSize={60} className="mx-auto" />
                <p className="text-gray-800 text-xl font-bold mt-4">Hapus roasting ehh posting</p>
                <p className="text-gray-600 text-base py-2 px-6">Kamu nanya?... Ingin menghapus?</p>
                <div className="flex items-center justify-between gap-4 w-full mt-6">
                  <button 
                  onClick={() => handleDeleteComment(idCommentForDelete)}
                  type="button"
                  disabled={deletingPost}
                  className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md outline-none  rounded-lg ">
                    {deletingPost ? <AiOutlineLoading3Quarters fontSize={24} className="mx-auto animate-spin"/> : 'Delete'}
                  </button>
                  <button 
                  onClick={() => {
                    setIdCommentForDelete(null);
                    setAlertDeleteDisplay(false);
                  }}
                  type="button" 
                  disabled={deletingPost}
                  className="py-2 px-4  bg-red-500 hover:bg-red-600 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md outline-none rounded-lg ">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {!loading && (
          <div className="flex xl:flex-row flex-col m-auto bg-white max-w-[1500px] rounded-[32px] pb-8">
            <div className={`relative w-full ${acpectImageType === 'square' ? 'aspect-square' : 'aspect-video'} flex justify-center items-center md:items-start flex-initial`}>
              <Image 
                src={`/api/imageproxy?url=${encodeURIComponent(pinDetail.image_url)}`} 
                alt={pinDetail.title}
                layout="fill" 
                objectFit="cover"
                className="rounded-3xl rounded-b-lg"
                onLoadingComplete={target => {
                  if(target.naturalWidth > target.naturalHeight){
                    setAcpectImageType('video')
                  }
                }}
              />
              <div className="absolute w-full h-full flex flex-col items-end justify-between p-2">
                <div className="bg-gradient-to-tr bg-white text-gray-900 opacity-80 font-bold px-5 py-2 text-base rounded-3xl hover:shadow-md outline-none cursor-default">
                    {pinDetail?.save ? pinDetail?.save.length : '0'} Saved
                </div>
                {alreadySaved ? (
                  <button 
                  type="button" 
                  className="bg-white text-red-500 py-2 px-5 font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer"
                  disabled={unsavingPost}
                  onClick={() => unsavePin(pinDetail)}>
                      {unsavingPost ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin">
                                <AiOutlineLoading3Quarters/>
                            </div>
                            <span>Unsaving...</span>
                          </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AiTwotoneHeart/>
                              <span>Unsaved</span>
                            </div>
                          )
                      }
                  </button>
                  ) : (
                  <button 
                  type="button"
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 py-2 px-5 text-white font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer"
                  disabled={savingPost}
                  onClick={() => savePin(pinDetail._id)}>
                      {savingPost ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin">
                                <AiOutlineLoading3Quarters/>
                            </div>
                            <span>Saving..</span>
                          </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AiTwotoneHeart/>
                              <span>Save</span>
                            </div>
                          )
                      }
                  </button>
                )}
              </div>
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <a
                  href={pinDetail?.image_url?.replace('=view', '=download')}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none hover:cursor-pointer"
                  >
                    <MdDownloadForOffline className="w-full h-full"/>
                  </a>
                </div>
                <a
                href={pinDetail?.image_url}
                target="_blank"
                rel="noreferrer"
                className="bg-white flex items-center gap-2 text-gray-700 font-bold p-2 px-4 hover:text-black"
                >
                    <BsFillArrowRightCircleFill />
                    {pinDetail.destination.length > 35 ? `${pinDetail?.destination.slice(8, 35)}...` : pinDetail?.destination.slice(8)}
                </a>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
                <p className="text-gray-500 text-sm">
                  {`${getHoursAndMinutes(pinDetail._createdAt)} ${getDateWithDayName(pinDetail._createdAt)}`}
                </p>
                <p className="mt-3 text-base sm:text-lg">{pinDetail.about}</p>
              </div>
              <Link href={`${process.env.URL}/user-profile/${pinDetail?.posted_by._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                <div className="hidden md:flex bg-gradient-to-tr from-yellow-500 to-violet-600 p-0.5 items-center justify-center w-8 sm:w-12 h-8 sm:h-12 relative rounded-full">
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                        <Image src={`/api/imageproxy?url=${encodeURIComponent(pinDetail?.posted_by.image_url)}`} alt="my-profile" layout="fill" objectFit="cover" />
                    </div>
                </div>
                <p className="font-semibold sm:text-xl capitalize">
                    {truncateName(pinDetail?.posted_by.username)}
                </p>
              </Link>
              <h2 className="mt-7 text-2xl font-bold border-b-[1px] border-gray-300 pb-3 mb-4">
                Comments {" "}
                <span className='font-normal'>{`(${pinDetail?.comments ? pinDetail?.comments?.length : 0})`}</span>
              </h2>
              <div className='max-h-370 overflow-y-auto pb-6 hide-scrollbar'>
                {pinDetail?.comments ? pinDetail.comments?.map((comment, index, arr) => (
                  <div 
                  className={`${index !== arr.length - 1 ? 'border-b-[1px] border-gray-300 pb-3' : ''} flex flex-col gap-2 mt-3 bg-white`} 
                  key={index}>
                    <div className="flex gap-2 bg-white rounded-lg">
                      <Link href={`user-profile/${pinDetail?.posted_by._id}`}
                      className="flex bg-white border-2 border-gray-900 p-0.5 items-center justify-center w-10 h-10 relative rounded-full">
                          <div className="relative w-full h-full overflow-hidden rounded-full">
                              <Image src={`/api/imageproxy?url=${encodeURIComponent(comment?.posted_by?.image_url)}`} alt="my-profile" layout="fill" objectFit="cover" />
                          </div>
                      </Link>
                      <div className="flex flex-col w-[85%]">
                        <p className="font-extrabold text-lg capitalize">
                            {truncateName(comment?.posted_by.username)}
                        </p>
                        <p>{comment.comment}</p>
                        <div className="flex items-center gap-3 text-sm font-sans">
                          <p className="text-gray-500">
                            {comment?.create_at}
                          </p>
                          {comment.posted_by._id === user.userId && (
                             <button 
                             onClick={e => {
                               setIdCommentForDelete(comment._key);
                               setAlertDeleteDisplay(true);
                             }}
                             type="button" 
                             className="text-red-600">
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="mt-2">Jadilah orang pertama yang meroasting poto pin ini hehe...</p>
                )}
              </div>
              <div className="flex w-full">
                <input 
                onChange={e => {
                  e.target.value.length < 3 ? setErrorCommentDisplay(true) : setErrorCommentDisplay(false);
                  setComment(e.target.value);
                }}
                type="text" 
                autoComplete="off" 
                placeholder="Tulis comment terkece kamu cmiww.."
                className={`${errorCommentDisplay ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-300'} flex-1 p-2 outline-none font-thin placeholder:font-thin border-2 rounded-lg`}
                value={comment} />
                
                <button 
                onClick={handleAddComment}
                disabled={addingComment}
                type="button"
                className="flex items-center justify-center p-2 ml-2">
                  {addingComment ?
                    <AiOutlineLoading3Quarters fontSize={24} className="mx-auto animate-spin"/> :
                    <GrSend fontSize={25}/>
                  }
                </button>
              </div>
            </div>
          </div>
        )}
        {pins?.length > 0 && (
          <>
            <h2 className="text-lg">More like this</h2>
            <MasonryLayout pins={pins} />
          </>
        )}
      </Pins>
    </Navigation>
  )
}

export default PinDetail