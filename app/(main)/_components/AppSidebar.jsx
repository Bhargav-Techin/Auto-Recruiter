'use client'
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SideBarOptions } from '@/services/Constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';

function AppSidebar() {

    const path = usePathname();
    console.log(path);
    const router = useRouter();

    return (
        <Sidebar>
            <SidebarHeader className='flex items-center'>
                <Image src={'/logo.png'} height={100} width={200} alt='logo' className='w-[150px]' />
                <Button className='w-full mt-4 ' onClick={() => router.push('/dashboard/create-interview')}> <Plus /> Create New Interview</Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarContent>
                        <SidebarMenu>
                            {SideBarOptions.map((option, index) => {
                                const Icon = option.icon;
                                return (
                                    <SidebarMenuItem key={index} className='p-2'>
                                        <Link href={option.path}>
                                            <SidebarMenuButton asChild className={`p-4 ${(path == option.path) ? 'bg-blue-100' : 'bg-transparent'}`}>
                                                <div className="flex items-center">
                                                    <Icon className={`mr-2 ${(path == option.path) ? 'text-primary' : 'text-foreground'}`} />
                                                    <span className={`text-[16px] ${(path == option.path) ? 'text-primary font-medium' : 'text-foreground'}`}>{option.name}</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar