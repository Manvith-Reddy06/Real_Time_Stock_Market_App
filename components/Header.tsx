import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import Dropdown from './Dropdown'
import { UserInfoOptions } from 'os'
import { searchStocks } from '@/lib/actions/finnhub.actions'
// import logo from '../'

const Header = async({user}:{user:User}) => {
  const initialStocks= await searchStocks();

  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper '>
            <Link href="/">
                <Image src="/assets/icons/logo.svg" alt='Signalist logo' width={140} height={32} className='h-8 w-auto cursor-pointer'></Image>
            </Link>
            <nav className='hidden sm:block'>
              {/* NavItems */}
              <NavItems initialStocks={initialStocks}/>
            </nav>
            {/* UserDropDown */}
            <Dropdown user={user} initialStocks={initialStocks}/>
        </div>
    </header>
  )
}

export default Header