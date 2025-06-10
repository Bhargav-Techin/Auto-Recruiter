import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { InterviewType } from '@/services/Constants'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

function FormContainer({ onHandleGenerate, onClickGenerateInterviewQuestions }) {
    const [interviewType, setInterviewType] = useState([]);
    useEffect(() => {
        onHandleGenerate('interviewType', interviewType);
    }, [interviewType]);

    const handleInterviewType = (type) => {
        if (interviewType.includes(type)) {
            setInterviewType(prev => prev.filter(t => t !== type));
        } else {
            setInterviewType(prev => [...prev, type]);
        }
    }
    return (
        <div className='bg-card rounded-lg p-4 shadow-md'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-sm font-medium'>Job Position</h1>
                    <Input type='text' placeholder='e.g. Software Engineer' onChange={(e) => onHandleGenerate('jobPosition', e.target.value)} />
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-sm font-medium'>Job Description</h1>
                    <Textarea placeholder='e.g. We are looking for a software engineer with 3 years of experience in React, Node.js, and MongoDB.' className='h-[200px]' onChange={(e) => onHandleGenerate('jobDescription', e.target.value)} />
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-sm font-medium'>Interview Duration</h1>
                    <Select onValueChange={(value) => onHandleGenerate('interviewDuration', value)} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-sm font-medium'>Interview Type</h1>
                    <div className='flex flex-wrap gap-2 '>
                        {InterviewType.map((type, index) => (
                            <div key={type.title} className={`flex items-center gap-2 rounded-3xl p-2 border border-border hover:bg-muted cursor-pointer ${interviewType.includes(type.title) ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`} onClick={() => handleInterviewType(type.title)}>
                                <type.icon className={`w-4 h-4 ${interviewType.includes(type.title) ? 'text-primary font-semibold' : 'text-muted-foreground'}`} />
                                <p>{type.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'><h1 className='text-sm font-medium'>Prompt</h1><span className='text-xs text-gray-500'>&#40; optional &#41;</span></div>
                    <Textarea
                        placeholder={`e.g.  JavaScript interview questions for a fresher.
                        - Focus on: variables, functions, ES6, DOM basics.
                        - Ask 5 clear, fundamental questions.
                        - Add 1–2 follow-ups to explore deeper understanding.`}
                        className="h-[200px]"
                        onChange={(e) => onHandleGenerate('jobPrompt', e.target.value)}
                    />

                </div>
            </div>
            <div className='flex justify-end mt-4'>
                <Button onClick={() => onClickGenerateInterviewQuestions()}>Generate Interview Questions <ArrowRight className='w-4 h-4' /></Button>
            </div>
        </div>
    )
}

export default FormContainer