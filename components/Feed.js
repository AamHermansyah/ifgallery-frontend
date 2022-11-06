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
    if(categoryId){
      setLoading(true);

      const query = searchQuery(categoryId);

      client.fetch(query)
      .then(data => {
        dispatch(addPins(data));
      })
      .finally(() => {
        setLoading(false);
      })
    }
  }, [categoryId]);

  useEffect(() => {
    if(pins === null){
      setLoading(true);

      if(categoryId){
        const query = searchQuery(categoryId);
  
        client.fetch(query)
        .then(data => {
          dispatch(addPins(data));
        })
        .finally(() => {
          setLoading(false);
        })
      } else {
        client.fetch(feedQuery)
        .then(data => {
          dispatch(addPins(data));
        })
        .finally(() => {
          setLoading(false);
        })
      }
    }
  }, []);

  if(loading) return <Spinner message="Sabar ya ini masih loading!" />

  return (
    <div>
      { pins && <MasonryLayout pins={pins}/> }
    </div>
  )
}

export default Feed