import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from './_components/AppSidebar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <SidebarTrigger />
        <WelcomeContainer />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardProvider