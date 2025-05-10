"use client"

import { useUser } from '@/app/provider';
import Image from 'next/image';
import React from 'react'

function WelcomeContainer() {
    const {user} = useUser();
  return (
    <div>
      <div className='flex items-center justify-between p-4 bg-muted rounded-lg shadow-md mx-12'>
        <div>
          <h1 className='text-2xl font-bold'>Welcome Back, {user?.name}</h1>
          <p className='text-sm text-muted-foreground'>AI-Driven Interviews, Hassle-Free Hiring</p>
        </div>
        {user?.picture ? (
          <Image 
            src={user.picture} 
            alt="Profile Picture" 
            width={40} 
            height={40} 
            className='rounded-full'
            priority
          />
        ) : (
          <div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white'>
            {user?.name?.[0]?.toUpperCase() || ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default WelcomeContainer