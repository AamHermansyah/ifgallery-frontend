import React, { useState } from 'react'
import Masonry from 'react-masonry-css'
import { MdOutlineAutoDelete } from 'react-icons/md'

import Pin from './Pin'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { deletePinQuery } from '../utils/data'
import { useRouter } from 'next/router'

const breakpoints = {
  default: 4,
  3000: 6,
  2000: 3,
  1000: 2,
  500: 1
}

function MasonryLayout({pins}) {
  const [alertDeleteDisplay, setAlertDeleteDisplay] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [idPinForDelete, setIdPinForDelete] = useState(null);

  const router = useRouter();

  const handleDeletePin = (id) => {
      setDeletingPost(true);

      const query = deletePinQuery(id);

      client
        .delete({ query })
        .then(() => {
            dispatch(deletePin(id));
        })
        .catch(err => {
          router.push('/500');
        })
        .finally(() => {
          setDeletingPost(false);
          setIdPinForDelete(null);
          setAlertDeleteDisplay(false);
        })
  }

  return (
    <>
      {alertDeleteDisplay && (
        <div id="alert-delete" className="fixed inset-0 flex items-center justify-center z-[100] bg-white bg-opacity-70 backdrop-blur-sm">
          <div className="shadow-lg rounded-2xl p-4 bg-white w-64 sm:w-[300px] m-auto">
            <div className="w-full h-full text-center my-3">
              <div className="flex h-full flex-col justify-between">
                <MdOutlineAutoDelete fontSize={60} className="mx-auto" />
                <p className="text-gray-800 text-xl font-bold mt-4">Hapus pin</p>
                <p className="text-gray-600 text-base py-2 px-6">Kamu nanya?... Ingin menghapus?</p>
                <div className="flex items-center justify-between gap-4 w-full mt-6">
                  <button 
                  onClick={() => handleDeletePin(idPinForDelete)}
                  type="button"
                  disabled={deletingPost}
                  className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md outline-none  rounded-lg ">
                    {deletingPost ? <AiOutlineLoading3Quarters fontSize={24} className="mx-auto animate-spin"/> : 'Delete'}
                  </button>
                  <button 
                  onClick={() => {
                    setIdPinForDelete(null);
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
      <Masonry className="flex animate-slide-fwd gap-2 md:gap-4" breakpointCols={breakpoints}>
        {pins?.map(pin => (
          <Pin key={pin._id} pin={pin} className="w-max" onDelete={id => {
            setIdPinForDelete(id);
            setAlertDeleteDisplay(true);
          }}/>
        ))}
      </Masonry>
    </>
  )
}

export default MasonryLayout