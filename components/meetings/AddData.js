import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { client } from "../../client";

const AddData = ({isSubject}) => {
    const [adding, setAdding] = useState(false);
    const [isValidInput, setIsValidInput] = useState('idle');
    const router = useRouter();

     // ref
     const semesterRef = useRef(null);
     const subjectOrMeetingRef = useRef(null);
     const timetableOrTopicRef = useRef(null);

    const handleAddData = () => {
        if(isSubject){
            const semester = +semesterRef.current.value.trim();
            const subject = subjectOrMeetingRef.current.value.trim();
            const timetable = timetableOrTopicRef.current.value.trim();
            const regex = /^(senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu)\s(\d\d:\d\d)$/gi;
            const isValid = semester < 0 || subject.length < 3 || !regex.test(timetable)

            if(isValid) return setIsValidInput(false);

            setIsValidInput(true);
            setAdding(true);

            const doc = {
                _type: 'subjects', semester, subject, timetable
            }

            client.create(doc)
                .then(() => {
                    router.reload();
                })
                .catch(() => {
                    router.push('/500');
                })
                .finally(() => {
                    setAdding(false);
                })
        }
    }

    return (
        <div className={`${!isValidInput ? 'border-red-500' : 'border-white'} border-2 w-full sm:max-w-[350px] h-max flex flex-col justify-between p-6 bg-white rounded-lg sm:rounded-xl`}>
            <div className={!isSubject ? 'mt-1' : '-mt-2'}>
                {isSubject && (
                    <div className="flex items-center gap-2 mt-[8px]">
                        <p className="w-max text-sky-500 text-md font-bold">Semester</p>
                        <input
                        ref={semesterRef}
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
                    ref={subjectOrMeetingRef}
                    type={isSubject ? 'text' : 'number'}
                    name={isSubject ? 'subject' : 'meeting'}
                    id={isSubject ? 'subject' : 'meeting'}
                    placeholder={isSubject ? 'Mata kuliah' : '0'}
                    className={`${isSubject ? 'w-full' : 'w-[60px]'} text-xl font-bold text-gray-800 capitalize outline-none`}
                    />
                </div>
                <input
                ref={timetableOrTopicRef}
                type="text"
                name={isSubject ? 'timetable' : 'topic'}
                id={isSubject ? 'timetable' : 'topic'}
                placeholder={isSubject ? 'Jadwal masuk (Ex. Senin 09:45)' : 'Topik materi'}
                className={`${isSubject ? 'relative -top-[4px]' : ''} py-1 w-full text-sm font-bold outline-none`}
                />
            </div>
            <div className="flex justify-between gap-4 w-full">
                <button
                type="button"
                disabled={adding}
                onClick={handleAddData}
                className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer disabled:opacity-50">
                    {adding ? 'Adding...' : 'Add'}
                </button>
            </div>
        </div>
    )
}

export default AddData