import React from 'react'
import Image from 'next/image'

function InterviewHeader() {
  return (
    <div className='w-full border-b border-gray-300 shadow-lg'>
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
        <Image
            src="/logo.png"
            alt="AutoRecruit Logo"
            width={200}
            height={40}
            className="my-2"
            priority
          />
          <p className="text-gray-600 font-medium">AI-Powered Interview Platform</p>
        </div>
    </div>
  )
}

export default InterviewHeader