import React, { useContext, useEffect, useState } from 'react'
import MasonryLayout from '../components/MasonryLayout'
import { client } from '../client'
import Spinner from '../components/Spinner'
import { useDispatch, useSelector } from 'react-redux';
import { addPins } from '../app/features/pins/pinsSlice';
import { useRouter } from 'next/router';

function Search() {
  const [loading, setLoading] = useState(true);
  const pins = useSelector(state => state.pins);
  const dispatch = useDispatch();
  const router = useRouter();
  const { q } = router.query;

  console.log(q);

  // useEffect(() => {
  //   dispatch(addPins([]));

  // }, []);

  return (
    <div>
      { loading && <Spinner message="Loading dulu bang..." /> }
      { pins?.length !== 0 && <MasonryLayout pins={pins} /> }
      { pins?.length === 0 && q === '' && !loading && (
        <div className="mt-10 text-center text-xl">Tidak ada pin ditemukan.</div>
      )}
    </div>
  )
}

export default Search