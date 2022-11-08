import Head from "next/head"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Custom500() {
    const router = useRouter();
    useEffect(() => {
        return () => {
            router.push(url);
        }
    })

    return (
        <>
            <Head>
                <title>Forgematics A - Terjadi kesalahan pada server:(</title>
                <meta name="description" content="Terjadi kesalahan pada server sehingga program tidak berjalan seperti semestinya."></meta>
            </Head>
            <section className="fixed inset-0 flex justify-center items-center bg-black">
                <h1 className="text-white text-md sm:text-xl"><span className="text-2xl sm:text-3xl font-bold">500</span> - Sistem terjadi bentrokan mohon maaf:(</h1>
            </section>
        </>
    )
  }