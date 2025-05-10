"use client"
import { Phone, Video } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation';

function CreateOptions() {
    const router = useRouter();
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        <div className='bg-card rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200' onClick={() => router.push('/dashboard/create-interview')}>
            <Video className='w-10 h-10 text-primary bg-muted rounded-full p-2' />
            <h3 className='text-lg font-semibold'>Create New Interview</h3>
            <p className='text-sm text-muted-foreground'>Create AI-Driven interviews and schedule them</p>
        </div>
        <div>
        <div className='bg-card rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200'>
            <Phone className='w-10 h-10 text-primary bg-muted rounded-full p-2' />
            <h3 className='text-lg font-semibold'>Create Phone Screening Call</h3>
            <p className='text-sm text-muted-foreground'>Schedule a phone screening call with the candidates</p>
        </div>
        </div>

    </div>
  )
}

export default CreateOptions