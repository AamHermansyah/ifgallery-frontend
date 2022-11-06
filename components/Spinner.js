import React from 'react'
import { Dna } from 'react-loader-spinner';

function Spinner({message}) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
        <Dna
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
        />
        <p className="text-lg text-center px-2">{message}</p>
    </div>
  )
}

export default Spinner