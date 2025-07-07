'use client'

import axios from 'axios';
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import QuestionListContainer from './QuestionListContainer';
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';


function QuestionList({ formData, revertProgress, onGenerateInterviewLink, setQuestionList, questionsList }) {
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [saveLoading, setSaveLoading] = useState(false)
    const apiCallMade = useRef(false);

    useEffect(() => {
        if (formData && !apiCallMade.current) {
            apiCallMade.current = true;
            GenerateQuestionsList();
        }
    }, [formData]);

    const GenerateQuestionsList = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/ai-model', { ...formData });
            let raw = response.data.message.trim();
            console.log(raw)

            // Remove markdown backticks if present
            if (raw.startsWith('```json')) {
                raw = raw.replace(/```json|```/g, '').trim();
            }

            const content = JSON.parse(raw);
            setQuestionList(content.interviewQuestions);

        } catch (error) {
            revertProgress(error.message || 'Failed to generate questions');
        } finally {
            setLoading(false);
        }
    }

    const onClickGenerateInterviewLink = async () => {

        setSaveLoading(true);
        const { data, error } = await supabase
            .from('Interviews')
            .insert([
                {
                    ...formData,
                    questionsList: questionsList,
                    userEmail: user?.email
                },
            ])
            .select()
        onGenerateInterviewLink(data[0].interview_id);
        setSaveLoading(false);
        console.log(data)
    }

    return (
        <div>
            {loading &&
                <div className='flex items-center flex-col gap-2 bg-muted p-4 mt-8 rounded-md'>
                    <div className='flex items-center gap-2'>
                        <Loader2Icon className='animate-spin' />
                        <h1 className='text-sm font-medium'>Generating Interview Questions...</h1>
                    </div>
                    <p className='text-sm text-foreground/60'>Our AI is crafting the perfect interview questions for you.</p>
                </div>}
            {questionsList && questionsList.length > 0 && (
                <QuestionListContainer questionsList={questionsList} />
            )}

            {!loading && <div className='flex justify-end mt-8'>
                <Button className='px-16' onClick={() => onClickGenerateInterviewLink()} disabled={saveLoading}>{saveLoading ? <Loader2 className='animate-spin' /> : 'Generate Interview Link'}</Button>
            </div>}
        </div>
    )
}

export default QuestionList