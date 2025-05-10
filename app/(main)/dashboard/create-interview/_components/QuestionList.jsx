'use client'

import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useState, useEffect } from 'react'

function QuestionList({ formData }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (formData) {
            GenerateQuestionsList();
        }
    }, [formData]);

    const GenerateQuestionsList = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/ai-model', { ...formData });
            console.log('Response data:', response.data.message);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
        } finally {
            setLoading(false);
        }
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
        </div>
    )
}

export default QuestionList