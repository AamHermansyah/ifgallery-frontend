import React from 'react'
import { useRouter } from "next/router"
import { useState } from "react"

const Card = ({data, isSubject, isAdmin}) => {
    const [displayDelete, setDisplayDelete] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);

    const router = useRouter();

    return (
        <div className="relative w-full sm:max-w-[350px] h-max bg-white rounded-lg sm:rounded-xl shadow-sm">
            {displayDelete && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm rounded-lg sm:rounded-xl">
                    <h1>Are you kidding me?</h1>
                    <div className="flex justify-center gap-4 w-full">
                        <div
                        onClick={e => {
                            setDisplayDelete(false);
                        }}
                        className="bg-red-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            Cancel
                        </div>
                        <div
                        onClick={e => e.stopPropagation()}
                        className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            Delete
                        </div>
                    </div>
                </div>
            )}

            {displayEdit && (
                <div className="absolute inset-0 flex flex-col justify-between p-6 bg-white rounded-lg sm:rounded-xl">
                    <div className={!isSubject ? 'mt-1' : '-mt-2'}>
                        {isSubject && (
                            <div className="flex items-center gap-2 mt-[8px]">
                                <p className="w-max text-sky-500 text-md font-bold">Semester</p>
                                <input
                                type="text"
                                name="semester"
                                id="semester"
                                placeholder="0"
                                className={`w-[50px] text-md font-bold outline-none`}
                                />
                            </div>
                        )}
                        <div className="flex gap-2 items-center -mt-1">
                            {!isSubject && <p className="text-xl font-bold text-gray-800 capitalize leading-3">Pertemuan ke </p>}
                            <input
                            type={isSubject ? 'text' : 'number'}
                            name={isSubject ? 'subject' : 'meeting'}
                            id={isSubject ? 'subject' : 'meeting'}
                            placeholder={isSubject ? 'Mata kuliah' : '0'}
                            className={`${isSubject ? 'w-full' : 'w-[60px]'} text-xl font-bold text-gray-800 capitalize outline-none`}
                            />
                        </div>
                        <input
                        type="text"
                        name={isSubject ? 'timetable' : 'topic'}
                        id={isSubject ? 'timetable' : 'topic'}
                        placeholder={isSubject ? 'Jadwal masuk (Ex. Senin 09:45)' : 'Topik materi'}
                        className={`${isSubject ? 'relative -top-[4px]' : ''} w-full text-sm font-bold outline-none`}
                        />
                    </div>
                    <div className="flex justify-between gap-4 w-full">
                        <div
                        onClick={e => {
                            setDisplayEdit(false);
                        }}
                        className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            Cancel
                        </div>
                        <div
                        onClick={e => e.stopPropagation()}
                        className="bg-red-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            Edit
                        </div>
                    </div>
                </div>
            )}

            <div 
            onClick={() => isSubject && router.push(`/meetings/${data._id}`)}
            className={`${isSubject ? 'cursor-pointer' : ''} p-6 gap-4 w-full`}>

                {isSubject && <p className="text-sky-500 text-md font-bold mb-1">Semester 1</p>}
                <p className="text-xl font-bold text-gray-800 capitalize leading-3">
                    {isSubject ? `${data.subject}` : `Pertemuan ke ${data.meeting}`}
                </p>

                <p className={`${isSubject ? 'font-bold' : ''} text-sm mt-2 text-gray-700`}>
                    {isSubject ? `Jadwal ${data.timetable}` : `${data.topic}`}
                </p>

                {isAdmin && (
                    <div className="flex justify-between">
                        <div
                        onClick={e => {
                            e.stopPropagation();
                            setDisplayEdit(true);
                        }}
                        className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            {isSubject ? 'Edit Matkul' : 'Edit'}
                        </div>

                        <div
                        onClick={e => {
                            e.stopPropagation();
                            setDisplayDelete(true);
                        }}
                        className="bg-red-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            Delete
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Card