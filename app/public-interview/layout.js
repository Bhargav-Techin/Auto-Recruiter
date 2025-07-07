import React from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { InterviewDetailsProvider } from './provider';

function InterviewLayout({ children }) {
  return (
    <InterviewDetailsProvider>
      <div>
        <InterviewHeader />
        {children}
      </div>
    </InterviewDetailsProvider>
  )
}

export default InterviewLayout;