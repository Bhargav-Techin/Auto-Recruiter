import React from 'react'
import DashboardProvider from './provider'
import AuthGuard from '@/components/AuthGuard'

function DashboardLayout({ children }) {
    return (
        <AuthGuard>
            <DashboardProvider>
                <div className='p-12'>
                    {children}
                </div>
            </DashboardProvider>
        </AuthGuard>
    )
}

export default DashboardLayout