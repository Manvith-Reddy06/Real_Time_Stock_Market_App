import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import Dropdown from './Dropdown'
// import logo from '../'

const Header = () => {
  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper '>
            <Link href="/">
                <Image src="/assets/icons/logo.svg" alt='Signalist logo' width={140} height={32} className='h-8 w-auto cursor-pointer'></Image>
            </Link>
            <nav className='hidden sm:block'>
              {/* NavItems */}
              <NavItems/>
            </nav>
            {/* UserDropDown */}
            <Dropdown/>
        </div>
    </header>
  )
}

export default Header