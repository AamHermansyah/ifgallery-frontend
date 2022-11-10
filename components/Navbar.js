import { useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import { IoMdSearch, IoMdAdd } from 'react-icons/io'
import { url } from '../utils/config';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = session;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <form 
        className="flex gap-2 justify-between items-center w-full"
        onSubmit={(e) => {
          e.preventDefault();
          searchTerm && router.push(`/search?q=${searchTerm}`);
        }}>
          <input
          type="text"
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => router.pathname !== '/search' && router.push('/search')}
          className="p-2 w-full bg-white outline-none"
          />
          <button type="submit">
            <IoMdSearch fontSize={21} />
          </button>
        </form>
      </div>
      <div className="flex gap-3">
        <Link href={`${url}/profile/${user.userId}`} className="hidden md:flex bg-gradient-to-tr from-pink-500 to-blue-600 p-0.5 items-center justify-center w-12 h-12 relative rounded-full">
          <div className="relative w-full h-full overflow-hidden rounded-full">
              <Image src={`/api/imageproxy?url=${encodeURIComponent(user.image)}`} alt="my-profile" layout="fill" objectFit="cover" />
          </div>
        </Link>
        {user?.role === 'admin' && (
          <Link href={`${url}/create-pin`} className="hidden md:flex bg-gradient-to-tr from-pink-500 to-blue-600 text-white shadow-md rounded-lg w-12 h-12 justify-center items-center">
            <IoMdAdd fontSize={25} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar