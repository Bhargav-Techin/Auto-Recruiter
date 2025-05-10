'use client'

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

function LatestInterviewsList() {
    const router = useRouter();
    const [interviewList, setInterviewList] = useState([]);
  return (
    <div className='my-4'>
        <div className='py-4 border-b '>
            <h2 className='text-2xl font-bold my-4'>Latest Interviews</h2>
        </div>
            {interviewList?.length==0 &&
             <div className='text-muted-foreground text-center bg-card rounded-lg p-4 mt-2 shadow-sm hover:shadow-md transition-shadow duration-200'>
                <p>You have not created any interviews yet</p>
                <Button className='mt-4 bg-primary text-white hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-200' onClick={() => router.push('/dashboard/create-interview')}> <Plus className='w-4 h-4 mr-[-4px]'/>Create New Interview</Button>
             </div>
            }
    </div>
  )
}

export default LatestInterviewsList