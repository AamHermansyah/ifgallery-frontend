import React from 'react'
import { useRouter } from "next/router"
import { useState } from "react"
import { client } from '../../client'
import { deleteQuery } from '../../utils/data'
import { truncateName } from '../../utils/truncateString'
import { v4 as uuidv4 } from 'uuid'

const Card = ({data, isSubject, isAdmin, currentData, user, id}) => {
    const [displayDelete, setDisplayDelete] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    // input state
    const [isValidInput, setIsValidInput] = useState('idle');
    const [semester, setSemester] = useState(data?.semester);
    const [subjectOrMeeting, setSubjectOrMeeting] = useState(isSubject ? data.subject : data.meeting);
    const [timetableOrTopic, setTimetableOrTopic] = useState(isSubject ? data.timetable : data.topic);

    // navigate
    const router = useRouter();

    const deleteData = () => {
        if(isSubject){
            setDeleting(true);
            const query = deleteQuery(data._id);

            client
                .delete({ query })
                .then(() => {
                    currentData("delete", data._id);
                })
                .catch(err => {
                    router.push('/500');
                })
                .finally(() => {
                    setDeleting(false);
                    setDisplayDelete(false);
                })

        } else {
            setDeleting(true);

            const queryRemove = ['meetings[0]', `meetings[_key=="${data._key}"]`]
            client
                .patch(id)
                .unset(queryRemove)
                .commit()
                .then(() => {
                    currentData("delete", data._key);
                })
                .catch(err => {
                    router.push('/500');
                })
                .finally(() => {
                    setDeleting(false);
                    setDisplayDelete(false);
                })
        }
    }

    const editData = () => {
        if(isSubject){
            const subject = subjectOrMeeting.trim();
            const timetable = timetableOrTopic.trim();
            const regex = /^(senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu)\s(\d\d:\d\d)$/gi;
            const isValid = semester < 0 || subject.length < 3 || !regex.test(timetable);

            if(isValid) return setIsValidInput(false);

            setIsValidInput(true);
            setSaving(true);

            const doc = {
                semester, subject, timetable
            }

            client
                .patch(data._id)
                .set(doc)
                .commit()
                .then(() => {
                    currentData("edit", {
                        id: data._id,
                        data: doc
                    });
                })
                .catch(() => {
                    router.push('/500');
                })
                .finally(() => {
                    setSaving(false);
                    setDisplayEdit(false);
                })

        } else {
            const meeting = subjectOrMeeting.trim();
            const topic = timetableOrTopic.trim();
            const isValid = +meeting > 0 || topic.length > 3;
            if(!isValid) return setIsValidInput(false);

            setIsValidInput(true);
            setSaving(true);

            const doc = {
                _key: uuidv4(),
                meeting,
                topic,
                create_at: data?.create_at ? data.create_at : '',
                posted_by: {
                    _type: 'posted_by',
                    _ref: user.userId
                  }
            }

            const queryRemove = ['meetings[0]', `meetings[_key=="${data._key}"]`]
            client
                .patch(id)
                .unset(queryRemove)
                .setIfMissing({ meetings: [] })
                .insert('after', 'meetings[-1]', [doc])
                .commit()
                .then(() => {
                    currentData("edit", {
                        key: data._key,
                        data: {
                            ...doc,
                            posted_by: {
                                username: user.name
                            }
                        }
                    });

                    setDisplayEdit(false);
                })
                .catch(err => {
                    router.push('/500');
                })
                .finally(() => {
                    setSaving(false);
                    setDisplayEdit(false);
                })
        }
    }

    return (
        <div className="relative w-full max-w-[500px] sm:max-w-[350px] h-max bg-white rounded-lg sm:rounded-xl shadow-sm">

            {data?.create_at && (
                <div className="absolute top-0 right-0 px-2 py-1 text-sm text-gray-700">
                    <p>{data.create_at}</p>
                </div>
            )}

            {displayDelete && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm rounded-lg sm:rounded-xl">
                    <h1>Are you kidding me?</h1>
                    <div className="flex justify-center gap-4 w-full">
                        <button
                        type="button"
                        disabled={deleting}
                        onClick={e => {
                            setDisplayDelete(false);
                        }}
                        className="border-sky-500 bg-white border-[1px] text-[.7rem] mt-2 w-max text-sky-500 pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                        type="button"
                        disabled={deleting}
                        onClick={deleteData}
                        className="bg-red-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer disabled:opacity-50">
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}

            {displayEdit && (
                <div className={`${isValidInput ? 'border-white' : 'border-red-500'} border-2 absolute inset-0 flex flex-col justify-between p-6 bg-white rounded-lg sm:rounded-xl`}>
                    <div className={!isSubject ? '-mt-1' : '-mt-2'}>
                        {isSubject && (
                            <div className="flex items-center gap-2 mt-[8px]">
                                <p className="w-max text-sky-500 text-md font-bold">Semester</p>
                                <input
                                autoComplete={false}
                                onChange={e => setSemester(e.target.value)}
                                value={semester}
                                type="text"
                                name="semester"
                                id="semester"
                                placeholder="0"
                                className="w-[50px] text-md font-bold outline-none"
                                />
                            </div>
                        )}
                        <div className="flex gap-2 items-center -mt-1">
                            {!isSubject && <p className="text-xl font-bold text-gray-800 capitalize leading-3">Pertemuan ke </p>}
                            <input
                            autoComplete={false}
                            onChange={e => setSubjectOrMeeting(e.target.value)}
                            value={subjectOrMeeting}
                            type={isSubject ? 'text' : 'number'}
                            name={isSubject ? 'subject' : 'meeting'}
                            id={isSubject ? 'subject' : 'meeting'}
                            placeholder={isSubject ? 'Mata kuliah' : '0'}
                            className={`${isSubject ? 'w-full' : 'w-[60px]'} text-xl font-bold text-gray-800 capitalize outline-none`}
                            />
                        </div>
                        <input
                        autoComplete={false}
                        onChange={e => setTimetableOrTopic(e.target.value)}
                        value={timetableOrTopic}
                        type="text"
                        name={isSubject ? 'timetable' : 'topic'}
                        id={isSubject ? 'timetable' : 'topic'}
                        placeholder={isSubject ? 'Jadwal masuk (Ex. Senin 09:45)' : 'Topik materi'}
                        className={`${isSubject ? 'relative -top-[4px] font-bold' : ''} h-[30px] pt-2 -mt-3 w-full text-sm outline-none`}
                        />
                    </div>
                    <div className="flex justify-between gap-4 w-full">
                        <button
                        type="button"
                        disabled={saving}
                        onClick={e => {
                            setIsValidInput('idle');
                            setDisplayEdit(false);
                            setSemester(isSubject && data.semester);
                            setSubjectOrMeeting(isSubject ? data.subject : data.meeting);
                            setTimetableOrTopic(isSubject ? data.timetable : data.topic);
                        }}
                        className="border-sky-500 bg-white border-[1px] text-[.7rem] mt-2 w-max text-sky-500 pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                        type="button"
                        disabled={saving}
                        onClick={editData}
                        className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer disabled:opacity-50">
                            {saving ? 'Saving...' : 'Edit'}
                        </button>
                    </div>
                </div>
            )}

            <div 
            onClick={() => isSubject && router.push(`/meetings/${data._id}`)}
            className={`${isSubject ? 'cursor-pointer' : ''} p-6 gap-4 w-full`}>

                <p className="text-sky-500 text-md font-bold mb-1 capitalize">
                    {isSubject ? `Semester ${data.semester}` : truncateName(data.posted_by.username)}
                </p>

                <p className="text-xl font-bold text-gray-800 capitalize leading-3">
                    {isSubject ? `${data.subject}` : `Pertemuan ke ${data.meeting}`}
                </p>

                <p className={`${isSubject ? 'font-bold' : ''} h-[30px] pt-2 text-sm text-gray-700`}>
                    {isSubject ? data.timetable : data.topic}
                </p>

                {isAdmin && (
                    <div className="flex justify-between">
                        <button
                        type="button"
                        onClick={e => {
                            e.stopPropagation();
                            setDisplayEdit(true);
                        }}
                        className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            {isSubject ? 'Edit Matkul' : 'Edit'}
                        </button>

                        <button
                        type="button"
                        onClick={e => {
                            e.stopPropagation();
                            setDisplayDelete(true);
                        }}
                        className="bg-red-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                            Delete
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Card