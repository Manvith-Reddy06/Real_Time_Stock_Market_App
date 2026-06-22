"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut } from "lucide-react";
import NavItems from "./NavItems";

import { useRouter } from 'next/navigation'
import { signOut } from "better-auth/api";
const Dropdown = ({user, initialStocks}:{user:User, initialStocks:StockWithWatchlistStatus[]}) => {
  const router=useRouter();
  // const user={name:'Manvith',email:'manvithreddy2021@gmail.com'}
  const handleSignOut =async()=>{
    await signOut();
    router.push('/sign-in')
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 text-gray-4 hover:text-yellow-300 cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://avatars.githubusercontent.com/u/161228744?v=4&size=64" />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold ">
                    {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-gray-400">
          <DropdownMenuLabel>
            <div className="flex relative items-center gap-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://avatars.githubusercontent.com/u/161228744?v=4&size=64" />
                <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold ">
                      {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-400">
                  {user.name}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>

          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-600"></DropdownMenuSeparator>
          <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
            <LogOut className="h-4 w-4 mr-2 hidden sm:block"/>
            LogOut
          </DropdownMenuItem>
          <DropdownMenuSeparator className="hidden sm:bg-gray-600"></DropdownMenuSeparator>
          <nav className="sm:hidden">
            <NavItems initialStocks={initialStocks}/>
          </nav>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Dropdown;
