"use client"

import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterViewLink from './_components/InterViewLink';
function CreateInterview() {
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewid, setInterviewId] = useState();
  const [questionsList, setQuestionList] = useState([]);

  const onHandleGenerate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }


  const onClickGenerateInterviewQuestions = () => {
    if (formData.organizationName && formData.jobPosition && formData.jobDescription && formData.interviewDuration && formData.interviewType.length) {
      onUpdateProgress()
    }
    else {
      toast.error('Please fill all the fields');
    }
  }


  const onGenerateInterviewLink = (interview_id) => {
    setInterviewId(interview_id);
    onUpdateProgress();
  }

  const onUpdateProgress = () => {
    setProgress(prev => prev + 1);
  }

  const onRevertProgress = (error) => {
    setProgress(prev => prev - 1);
    toast.error(error);
  }
  return (
    <div className='px-8 md:px-16 lg:px-40 xl:px-56'>
      <div className='flex flex-start items-center gap-4'>
        <ArrowLeft className='w-6 h-6 cursor-pointer' onClick={() => router.back()} />
        <h1 className='text-xl font-bold'>Create Interview</h1>
      </div>
      <Progress value={progress * 33.33} className='w-full my-4' />
      {progress === 1 && <FormContainer onHandleGenerate={onHandleGenerate} onClickGenerateInterviewQuestions={onClickGenerateInterviewQuestions} />}
      {progress === 2 && <QuestionList formData={formData} revertProgress={onRevertProgress} onGenerateInterviewLink={(interview_id) => onGenerateInterviewLink(interview_id)} setQuestionList={setQuestionList} questionsList={questionsList} />}
      {progress === 3 && <InterViewLink interview_id={interviewid} formData={formData} questionsList={questionsList} />}
    </div>
  )
}

export default CreateInterview