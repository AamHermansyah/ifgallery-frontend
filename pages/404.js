import Head from "next/head";

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Forgematics A - Halaman tidak ditemukan:(</title>
                <meta name="description" content="Terjadi kesalahan pada client atau halaman tidak ditemukan."></meta>
            </Head>
            <section className="fixed inset-0 flex justify-center items-center bg-black">
                <h1 className="text-white text-md sm:text-xl"><span className="text-2xl sm:text-3xl font-bold">404</span> - Halaman mengghosting begitu saja:(</h1>
            </section>
        </>
    )
  }