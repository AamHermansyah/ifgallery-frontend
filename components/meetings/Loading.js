import React from 'react'
import Spinner from '../Spinner'

const Loading = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 justify-items-center">
            <div className="gap-4 w-full sm:max-w-[350px] h-max bg-white px-6 py-3 rounded-lg sm:rounded-xl shadow-sm">
                <Spinner width={50} height={50} />
                <p className="text-sm font-bold mt-2 text-center my-2">Loading...</p>
            </div>
            <div className="gap-4 w-full sm:max-w-[350px] h-max bg-white px-6 py-3 rounded-lg sm:rounded-xl shadow-sm">
                <Spinner width={50} height={50} />
                <p className="text-sm font-bold mt-2 text-center my-2">Loading...</p>
            </div>
            <div className="gap-4 w-full sm:max-w-[350px] h-max bg-white px-6 py-3 rounded-lg sm:rounded-xl shadow-sm">
                <Spinner width={50} height={50} />
                <p className="text-sm font-bold mt-2 text-center my-2">Loading...</p>
            </div>
            <div className="gap-4 w-full sm:max-w-[350px] h-max bg-white px-6 py-3 rounded-lg sm:rounded-xl shadow-sm">
                <Spinner width={50} height={50} />
                <p className="text-sm font-bold mt-2 text-center my-2">Loading...</p>
            </div>
        </div>
    )
}

export default Loading