import React from 'react'
import DashboardProvider from './provider'

function DashboardLayout({ children }) {
    return (
        <DashboardProvider>
            <div className='p-12'>
                {children}
            </div>
        </DashboardProvider>
    )
}

export default DashboardLayout