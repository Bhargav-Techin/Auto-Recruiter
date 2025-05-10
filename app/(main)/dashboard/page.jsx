import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
function Dashboard() {
  return (
    <div>
      {/* <WelcomeContainer/> */}
      <h2 className='text-2xl font-bold my-4'>Dashboard</h2>
      <CreateOptions/>
      <LatestInterviewsList/>
    </div>
  )
}

export default Dashboard