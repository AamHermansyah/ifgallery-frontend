import React from 'react'
import Navigation from './Navigation'
import Card from '../components/meetings/Card';
import AddData from '../components/meetings/AddData';
import Loading from '../components/meetings/Loading';

function Meetings({data, isSubject, user, loading, currentData}) {

     return (
        <Navigation>
            <section className="min-h-screen bg-[#9FC1FF] pt-4">

                {loading && <Loading />}

                {!loading && data?._id && user?.role === "admin" && (
                    <div className="px-4 mt-4">
                        <AddData isSubject={isSubject} user={user} id={data._id} currentData={(type, data) => currentData(type, data)} />
                    </div>
                )}

                {!isSubject && !loading && (
                    <div className="p-4">
                        <h1 className="font-bold text-xl  sm:text-2xl mb-2">{`${data.subject} (Semester ${data.semester},  ${data.timetable})`}</h1>
                        {!data.meetings && <p className="text-xl font-bold text-center my-4">Pertemuan mata kuliah masih kosong.</p>}
                        {data.meetings?.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mt-2">
                                {data.meetings.map((res, index) => (
                                    <Card 
                                    key={index}
                                    data={res}
                                    isSubject={isSubject} 
                                    isAdmin={user?.role === 'admin'}
                                    currentData={(type, data) => currentData(type, data)}
                                    user={user}
                                    id={data._id} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {isSubject && (
                    <div className="p-4">
                        {!loading && data.length === 0 && <p className="text-xl font-bold text-center my-4">Data masih kosong:(</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mt-2">
                            {!loading && data.length > 0 && data
                            .map(res => (
                                <Card 
                                key={res._id}
                                data={res}
                                isSubject={isSubject} 
                                isAdmin={user?.role === 'admin'} />
                            ))}
                        </div>
                    </div>
                )}

            </section>
        </Navigation>
    )
}

export default Meetings