import React, { useState, useEffect } from 'react'
import useRouter from 'next/router';

import { client } from '../client';
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data';
import { useDispatch, useSelector } from 'react-redux';
import { addPins } from '../app/features/pins/pinsSlice';

function Feed() {
  const [loading, setLoading] = useState(false);
  const pins = useSelector(state => state.pins);

  const router = useRouter;
  const { categoryId } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal();

    dispatch(addPins([]));
    if(categoryId){
      const query = searchQuery(categoryId);

      client.fetch(query, { signal })
      .then(data => {
        dispatch(addPins(data));
      })
      .catch(err => {
        if(err.name === "AbortError") return;
        router.push('/500');
      })
      .finally(() => {
        setLoading(false);
      })
    } else {
      client.fetch(feedQuery, { signal })
      .then(data => {
        dispatch(addPins(data));
      })
      .catch(err => {
        if(err.name === "AbortError") return;
        router.push('/500');
      })
      .finally(() => {
        setLoading(false);
      })
    }

    return () => {
      controller.abort();
    }
  }, [categoryId]);

  if(loading) return <Spinner message="Sabar ya ini masih loading!" />

  if(!pins?.length) return <h2 className="text-center p-2">Hhmm... belum ada yang upload pada saat ini.</h2>

  return (
    <div>
      { pins && <MasonryLayout pins={pins}/> }
    </div>
  )
}

export default Feed