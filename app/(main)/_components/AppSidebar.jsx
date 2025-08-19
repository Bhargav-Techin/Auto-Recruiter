'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { SideBarOptions } from '@/services/Constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { toast } from 'sonner';

function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      toast.error("Logout failed");
      return;
    }

    setUser(null); // clear context
    toast.success("Logged out successfully");
    router.push('/auth');
  };

  return (
    <Sidebar>
      <SidebarHeader className='flex flex-col items-center'>
        <Image src={'/logo.png'} height={100} width={200} alt='logo' className='w-[150px]' />
        <Button
          className='w-full mt-4'
          onClick={() => router.push('/dashboard/create-interview')}
        >
          <Plus className="mr-2" />
          Create New Interview
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => {
                const Icon = option.icon;
                const isActive = path === option.path;

                return (
                  <SidebarMenuItem key={index} className='p-2'>
                    <Link href={option.path}>
                      <SidebarMenuButton
                        asChild
                        className={`p-4 ${isActive ? 'bg-blue-100' : 'bg-transparent'}`}
                      >
                        <div className="flex items-center">
                          <Icon className={`mr-2 ${isActive ? 'text-primary' : 'text-foreground'}`} />
                          <span className={`text-[16px] ${isActive ? 'text-primary font-medium' : 'text-foreground'}`}>
                            {option.name}
                          </span>
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

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem className="p-2">
            <SidebarMenuButton
              onClick={handleLogout}
              className="p-4 hover:bg-red-50 w-full text-left"
            >
              <div className="flex items-center">
                <LogOut className="mr-2 text-red-600" />
                <span className="text-red-600 text-[16px] font-medium">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
