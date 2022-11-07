import Head from "next/head";
import { Feed, Navbar } from "../components";
import Navigation from "../container/Navigation";
import Pins from "../container/Pins";

export default function Index() {
  return (
    <Navigation>
      <Pins>
        <Head>
          <title>Welcome gaes! | Forgematics A 2022</title>
          <meta name="description" content="Silahkan untuk login terlebih dahulu sebelum anda melihat pin yang tersedia" />
          <meta name="keywords" content="Pin, Forgematics, Unsil, Universitas, Siliwangi" />
        </Head>
        <div className="bg-gray-50">
          <Navbar />
        </div>
        <Feed />
      </Pins>
    </Navigation>
  )
}
