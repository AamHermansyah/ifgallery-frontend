import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
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
import { AiOutlineLoading3Quarters, AiTwotoneDelete, AiTwotoneEdit, AiTwotoneHeart } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import MasonryLayout from '../../components/MasonryLayout';
import { getDateWithDayName, getHoursAndMinutes } from '../../utils/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { addPins } from '../../app/features/pins/pinsSlice';
import Head from 'next/head';
import { url } from '../../utils/config';
import DeletePinDetail from '../../components/DeletePinDetail';

function PinDetail() {
  const [acpectImageType, setAcpectImageType] = useState('square');
  const [pinDetail, setPinDetail] = useState(null);
  const [addingComment, setAddingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorCommentDisplay, setErrorCommentDisplay] = useState(false);

  // save and unsaving state
  const [savingPost, setSavingPost] = useState(false);
  const [unsavingPost, setUnsavingPost] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  // delete comment state
  const [alertDeleteCommentDisplay, setAlertDeleteCommentDisplay] = useState(false);
  const [idCommentForDelete, setIdCommentForDelete] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);

  // delete pin state
  const [idPinForDelete, setIdPinForDelete] = useState(null);

  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const user = session?.user;

  // redux
  const dispatch = useDispatch();
  const pins = useSelector(state => state.pins);

  // ref
  const commentRef = useRef(null);

  const fetchPinDetail = (signal) => {
    let queryFetch = pinDetailQuery(id);
    if(queryFetch){
      client.fetch(queryFetch)
      .then(data => {
        if(data[0]){
          setPinDetail(data[0]);
          queryFetch = pinDetailMorePinQuery(data[0]);

          client
          .fetch(queryFetch, { signal })
          .then(res => {
            dispatch(addPins(res));
          })
        } else router.push('/404');
        
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    !loading && setLoading(true);
    fetchPinDetail(signal);

    return () => {
      controller.abort();
    }
  }, [id]);

  useEffect(() => {
    if(pinDetail && user){
      setAlreadySaved(!!(pinDetail?.save?.filter(item => item.posted_by?._id === user.userId))?.length);
    }
  }, [pinDetail, user])

  // save pin
  const savePin = (id) => {
    if(!alreadySaved && user){
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
            setPinDetail(prev => {
              const prevSave = prev?.save ? prev.save : [];
              return {
                ...prev,
                save: [
                  ...prevSave,
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
              }
            });
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
    if(key && user){
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
  const handleAddComment = (event) => {
    event.preventDefault();

    if(!user) return;

    const comment = commentRef.current.innerText.trim().replace(/(\n\n\n+)/igm, '\n\n');

    if(commentRef.current.textContent  < 3 || errorCommentDisplay) {
      console.log(comment);
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
        setPinDetail(prev => {
          const prevComment = prev?.comments ? prev.comments : [];
          return {
            ...prev,
            comments: [
              ...prevComment,
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
          }
        })
        commentRef.current.innerText = '';
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
    if(user){
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
            setAlertDeleteCommentDisplay(false);
          });
    }
  }

  return (
    <Navigation>
      <Pins>
        {!loading && (
          <Head>
            <title>{pinDetail?.title} | {pinDetail?.posted_by?.username}</title>
            <meta name="description" content={pinDetail?.about} />
            <meta name="author" content={pinDetail?.posted_by?.username} />
          </Head>
        )}

        {loading && (
          <div className="p-4">
            <Spinner message="Sabar ya ini masih loading..." />
          </div>
        )}

        <DeletePinDetail idPinForDelete={idPinForDelete} clearIdPin={state => setIdPinForDelete(state)} />

        {alertDeleteCommentDisplay && user && (
          <div id="alert-delete" className="fixed inset-0 flex items-center justify-center z-[100] bg-white bg-opacity-70 backdrop-blur-sm">
            <div className="shadow-lg rounded-2xl p-4 bg-white w-64 sm:w-[300px] m-auto">
              <div className="w-full h-full text-center my-3">
                <div className="flex h-full flex-col justify-between">
                  <MdOutlineAutoDelete fontSize={60} className="mx-auto" />
                  <p className="text-gray-800 text-xl font-bold mt-4">Hapus roasting</p>
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
                      setAlertDeleteCommentDisplay(false);
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
          <div className="flex xl:flex-row flex-col m-auto bg-white max-w-[1500px] rounded-lg md:p-2">
            <div className={`relative w-full ${acpectImageType === 'square' ? 'aspect-square' : 'aspect-video'} flex justify-center items-center md:items-start flex-initial`}>
              <Image 
                src={`/api/imageproxy?url=${encodeURIComponent(pinDetail.image_url)}`} 
                alt={pinDetail.title}
                layout="fill" 
                objectFit="cover"
                className="rounded-xl"
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
                {user && (
                  <div className="flex justify-between w-full">
                    {pinDetail?.posted_by?._id === user?.userId && (
                      <div className="flex w-max">
                        <button 
                        type="button" 
                        className="bg-white text-red-500 py-2 px-5 font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer"
                        onClick={() => setIdPinForDelete(pinDetail?._id)}>
                          <div className="flex items-center gap-2">
                            <AiTwotoneDelete />
                            <span>Delete</span>
                          </div>
                        </button>
                        <Link 
                        href={`${url}/edit-pin/${pinDetail?._id}`}
                        className="block bg-white text-red-500 py-2 px-5 ml-3 font-bold text-base rounded-3xl hover:shadow-md outline-none cursor-pointer">
                          <div className="flex items-center gap-2">
                              <AiTwotoneEdit />
                              <span>Edit</span>
                          </div>
                        </Link>
                      </div>
                    )}
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
                      onClick={() => savePin(pinDetail?._id)}>
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
                )}
              </div>
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
              {user && (
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
                  className="bg-white flex items-center gap-2 text-gray-700 font-bold p-2 px-4 hover:text-black">
                      <BsFillArrowRightCircleFill />
                      {pinDetail.destination.length > 35 ? `${pinDetail?.destination.slice(8, 35)}...` : pinDetail?.destination.slice(8)}
                  </a>
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
                <p className="text-gray-500 text-sm">
                  {`${getHoursAndMinutes(pinDetail._createdAt)} ${getDateWithDayName(pinDetail._createdAt)}`}
                </p>
                <p className="mt-3 text-base sm:text-lg" style={{whiteSpace: 'pre-line'}}>{pinDetail.about}</p>
              </div>
              <Link href={`${url}/profile/${pinDetail?.posted_by?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                <div className="flex bg-gradient-to-tr from-yellow-500 to-violet-600 p-0.5 items-center justify-center w-10 sm:w-12 h-10 sm:h-12 relative rounded-full">
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                        <Image src={`/api/imageproxy?url=${encodeURIComponent(pinDetail?.posted_by?.image_url)}`} alt="author-profile" layout="fill" objectFit="cover" />
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
                      <Link href={`${url}/profile/${comment?.posted_by._id}`}
                      className="flex bg-white border-2 border-gray-900 p-0.5 items-center justify-center w-10 h-10 relative rounded-full">
                          <div className="relative w-full h-full overflow-hidden rounded-full">
                              <Image src={`/api/imageproxy?url=${encodeURIComponent(comment?.posted_by?.image_url)}`} alt={`${comment?.posted_by?.username} profile`} layout="fill" objectFit="cover" />
                          </div>
                      </Link>
                      <div className="flex flex-col w-[85%]">
                        <p className="font-extrabold text-lg capitalize">
                            {truncateName(comment?.posted_by.username)}
                        </p>
                        <p style={{whiteSpace: 'pre-line'}}>{comment.comment}</p>
                        <div className="flex items-center gap-3 text-sm font-thin mt-2">
                          <p className="text-gray-500">
                            {comment?.create_at}
                          </p>
                          {comment.posted_by._id === user?.userId && (
                             <button 
                             onClick={e => {
                               setIdCommentForDelete(comment._key);
                               setAlertDeleteCommentDisplay(true);
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
              {user && (
                <form className="flex w-full resize-none overflow-hidden max-h-[150px]">
                  <div className={`${errorCommentDisplay ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-300'} relative w-full box-border border-2 border-gray-200 hide-scrollbar rounded-lg overflow-hidden`}
                  onClick={e => e.target.focus()}>
                    <div className="relative px-4 py-2">
                      <div contentEditable
                      ref={commentRef}
                      suppressContentEditableWarning={true}
                      onInput={e => {
                        e.target.textContent.length < 3 ? setErrorCommentDisplay(true) : setErrorCommentDisplay(false);
                      }}
                      className="peer overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words z-[1] max-h-[150px] min-h-[20px] pb-0.5 outline-none hide-scrollbar" />
                      <div className="text-gray-600 peer-empty:opacity-100 opacity-0 mt-2.5 absolute top-0 select-none pointer-events-none">
                        Tulis comment terkece kamu cmiww..
                      </div>
                    </div>
                  </div>
                  
                  <button 
                  onClick={handleAddComment}
                  disabled={addingComment}
                  type="submit"
                  className="flex items-center justify-center p-2 ml-2">
                    {addingComment ?
                      <AiOutlineLoading3Quarters fontSize={24} className="mx-auto animate-spin"/> :
                      <GrSend fontSize={25}/>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        {pins?.length > 0 && !loading  && (
          <>
            <h2 className="text-lg mt-4">More like this</h2>
            <MasonryLayout pins={pins} />
          </>
        )}
      </Pins>
    </Navigation>
  )
}

export default PinDetail