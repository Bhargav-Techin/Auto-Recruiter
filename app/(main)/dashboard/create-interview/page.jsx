"use client"

import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
function CreateInterview() {
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [formData, setFormData] = useState({});

  const onHandleGenerate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }
  const onUpdateProgress = () => {
    if (formData.jobPosition && formData.jobDescription && formData.interviewDuration && formData.interviewType.length) {
      setProgress(prev => prev + 1);
    }
    else {
      toast.error('Please fill all the fields');
    }
  }
  return (
    <div className='px-12 md:px-24 lg:px-48 xl:px-64'>
      <div className='flex flex-start items-center gap-4'>
        <ArrowLeft className='w-6 h-6 cursor-pointer' onClick={() => router.back()} />
        <h1 className='text-xl font-bold'>Create Interview</h1>
      </div>
      <Progress value={progress * 33.33} className='w-full my-4' />
      {progress === 1 && <FormContainer onHandleGenerate={onHandleGenerate} updateProgress={onUpdateProgress} />}
      {progress === 2 && <QuestionList formData={formData} />}
    </div>
  )
}

export default CreateInterview