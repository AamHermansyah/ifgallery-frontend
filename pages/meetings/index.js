import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Meetings from '../../container/Meetings';
import { useSession } from 'next-auth/react';
import { client } from '../../client';
import { subjectsQuery } from '../../utils/data';
import { useRouter } from 'next/router';

function MeetingsPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { data: session } = useSession();

    const router = useRouter();

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
            controller.abort()
        }
    }, []);

    return (
        <>
            <Head>
                <title>Daftar mata kuliah Forgematics A</title>
                <meta name="description" content="Daftar mata kuliah yang sedang ditempuh saat ini" />
            </Head>

            <Meetings data={data} isSubject={true} user={session?.user} loading={loading} />
       </>
    )
}

export default MeetingsPage