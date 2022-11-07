import React, { useContext, useEffect, useState } from 'react'
import MasonryLayout from '../components/MasonryLayout'
import { client } from '../client'
import Spinner from '../components/Spinner'
import { useDispatch, useSelector } from 'react-redux';
import { addPins } from '../app/features/pins/pinsSlice';
import { useRouter } from 'next/router';
import { searchQuery } from '../utils/data';

function Search() {
  const [loading, setLoading] = useState(false);
  const pins = useSelector(state => state.pins);
  const dispatch = useDispatch();
  const router = useRouter();
  const { q } = router.query;

  useEffect(() => {
    dispatch(addPins([]));
    const controller = new AbortController();
    const signal = controller.signal();

    if(q){
      setLoading(true);
      const query = searchQuery(q.toLowerCase());
      client.fetch(query, { signal })
      .then(data => {
        dispatch(addPins(data));
      })
      .catch(err => {
        if(err.name === "AbortError") return;
        router.push('/500')
      })
      .finally(() => {
        setLoading(false);
      })
    }

    return () => {
      controller.abort();
    }
  }, [q]);

  if(!q) return <h2 className="mt-10 text-center text-xl">Hayo mau nyari apa? xixi...</h2>

  return (
    <div>
      { loading && <Spinner message="Loading dulu bang..." /> }
      { pins?.length !== 0 && <MasonryLayout pins={pins} /> }
      { pins?.length === 0 && !loading && (
        <div className="mt-10 text-center text-xl">Pin tidak ditemukan, kena ghosting wkwk</div>
      )}
    </div>
  )
}

export default Search