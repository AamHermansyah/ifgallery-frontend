import React from 'react'
import { Dna } from 'react-loader-spinner'

function Loading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2">
      <Dna
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperClass="dna-wrapper"
      />
      <div className="animate-pulse mt-4 text-center">
        <p className="text-2xl">FORGEMATICS A</p>
        <p className="text-xl">We are the impossible of future!</p>
      </div>
    </div>
  )
}

export default Loading