import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { client } from '../../client';
import { Spinner } from '../../components';
import CardMemberList from '../../components/CardMemberList'
import Navigation from '../../container/Navigation'
import { memberQuery } from '../../utils/data';
import { randomImage } from '../../utils/randomImageUrl'

function MemberListPage() {
    const [member, setMember] = useState(null);
    const randomImageUrl = randomImage();
    const router = useRouter();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const query = memberQuery();
        client.fetch(query, { signal })
        .then((data) => {
            setMember(data);
        })
        .catch((err) => {
            if(err.name === "AbortError") return;
            router.push('/500');
        })

        return () => {
            controller.abort();
        }
    }, []);
    
    return (
        <Navigation>
            <section className="flex flex-wrap gap-4 md:gap-6 justify-center min-h-screen px-2 py-4 md:p-6 bg-[#9FC1FF]">
                {!member ? (
                    <>
                        <CardMemberList skeleton={true} />
                        <CardMemberList skeleton={true} />
                        <CardMemberList skeleton={true} />
                        <CardMemberList skeleton={true} />
                    </>
                ) : (
                    member.map((user, index) => (
                        <CardMemberList user={user} banner_url={randomImageUrl[index]} key={user._id} />
                    ))
                )}
            </section>
        </Navigation>
    )
}

export default MemberListPage