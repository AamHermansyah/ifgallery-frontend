const AddData = ({isSubject}) => {
    return (
        <div className="w-full sm:max-w-[350px] h-max flex flex-col justify-between p-6 bg-white rounded-lg sm:rounded-xl">
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
                className="bg-sky-500 text-[.7rem] mt-2 w-max text-white pb-1 pt-2 px-3 shadow-md outline-none rounded-sm cursor-pointer">
                    Add
                </div>
            </div>
        </div>
    )
}

export default AddData