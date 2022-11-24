import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Meetings from '../../container/Meetings';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { subjectDetailQuery } from '../../utils/data';
import { client } from '../../client';

function MeetingsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    const router = useRouter();
    const { id } = router.query;

    const handleCurrentData = (type, payload) => {
        if(type === "add"){
            setData(prev => {
                const currentData = prev.meetings?.length > 0 ? [...prev.meetings, payload].sort((a, b) => a.meeting - b.meeting) : [payload]
                return {
                    ...prev,
                    meetings: currentData
                }
            })
        }

        if(type === "edit"){
            const currentData = data.meetings.map(res => res._key === payload.key ? payload.data : res);

            setData(prev => ({
                ...prev,
                meetings: currentData
            }))
        }

        if(type === "delete"){
            const currentData = data.meetings.filter(res => res._key !== payload);

            setData(prev => ({
                ...prev,
                meetings: currentData
            }))
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const dataId = subjectDetailQuery(id);

        client.fetch(dataId, { signal })
        .then(res => {
            if(res[0]){
                setData(res[0]);
                setLoading(false);
            } else router.push('/');
        })
        .catch(err => {
            if(err.name === "AbortError") return;
            router.push('/500');
        })

        return () => {
            controller.abort();
            setLoading(true);
        }
    }, []);
                            
    return (
        <>
            <Head>
                <title>Pertemuan mata kuliah Forgematics kelas A</title>
            </Head>

            <Meetings data={data} user={session?.user} loading={loading} currentData={(type, data) => handleCurrentData(type, data)} />
       </>
    )
}

export default MeetingsPage
