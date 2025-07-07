'use client'
import React, { useState } from 'react';
import { InterviewDetailsContext } from "@/context/InterviewDetailsContext";

export function InterviewDetailsProvider({ children }) {
    const [interviewDetails, setInterviewDetails] = useState(null)
    const value = {
        interviewDetails,
        setInterviewDetails,
    };
    return (
        <InterviewDetailsContext.Provider value={value}>
            {children}
        </InterviewDetailsContext.Provider>
    )
}