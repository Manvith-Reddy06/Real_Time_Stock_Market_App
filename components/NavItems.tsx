'use client'
import React from 'react'
import { NAV_ITEMS } from '@/stocks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItems = () => {
    const PathName=  usePathname()
    const isActive=(path:string)=>{
        if(path==='/')return PathName==='/';
        return PathName.startsWith(path);

    }
  return (
    <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-2 font-medium hover:cursor-pointer'>
        {NAV_ITEMS.map(({href,label})=>(
            <li key={href}>
                <Link href={href} className={`hover:text-yellow-500 transition-colors cursor-pointer ${
                        isActive(href)?'text-gray-100':''
                }`}>

                {label}
                </Link>

            </li>

        ))}
    </ul>
  )
}

export default NavItems