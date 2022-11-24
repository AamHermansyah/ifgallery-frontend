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

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const dataId = subjectDetailQuery(id);

        client.fetch(dataId, { signal })
        .then(res => {
            if(res[0]){
                setData(res[0]);
            } else router.push('/');
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
                <title>Pertemuan mata kuliah Forgematics kelas A</title>
            </Head>

            <Meetings data={data} user={session?.user} loading={loading} />
       </>
    )
}

export default MeetingsPage
