import React, { useState } from 'react'
import Head from 'next/head'
import Meetings from '../../container/Meetings';
import { useSession } from 'next-auth/react';

function MeetingsPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
                            subject: 'Kalkulus 1', 
                            timetable: 'Senin, 09:45', 
                            topic: 'Pentingnya literasi dalam kehidupan sehari hari',
                            meeting: '12'});

    const { data: session } = useSession();
                            
     return (
        <>
            <Head>
                <title>Pertemuan mata kuliah Forgematics kelas A</title>
            </Head>

            <Meetings data={data} user={session?.user} loading={loading} />
       </>
    )
}

export default MeetingsPage
