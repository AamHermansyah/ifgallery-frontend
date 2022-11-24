import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Meetings from '../../container/Meetings';
import { useSession } from 'next-auth/react';
import { client } from '../../client';
import { subjectsQuery } from '../../utils/data';
import { useRouter } from 'next/router';

function MeetingsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { data: session } = useSession();

    const router = useRouter();

    const handleCurrentData = (type, payload) => {
        if(type === "delete") {
            setData(prev => prev.filter(res => res._id !== payload));
        }

        if(type === "edit"){
            setData(prev => prev.map(res => res._id === payload.id ? {_id: payload.id, ...payload.data} : res));
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        client.fetch(subjectsQuery, { signal })
        .then(res => {
            setData(res);
        })
        .catch(err => {
            if(err.name === "AbortError") return;
            router.push('/500');
        })
        .finally(() => {
            setLoading(false);
        })

        return () => {
            controller.abort();
            setLoading(true);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Daftar mata kuliah Forgematics A</title>
                <meta name="description" content="Daftar mata kuliah yang sedang ditempuh saat ini" />
            </Head>

            <Meetings data={data} isSubject={true} user={session?.user} loading={loading} currentData={(type, data) => handleCurrentData(type, data)} />
       </>
    )
}

export default MeetingsPage