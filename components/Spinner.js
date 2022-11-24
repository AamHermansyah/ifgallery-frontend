import React from 'react'
import { Dna } from 'react-loader-spinner';

function Spinner({message, width = 80, height = 80}) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
        <Dna
        height={width}
        width={height}
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper"
        />
        <p className="text-lg text-center px-2">{message}</p>
    </div>
  )
}

export default Spinner