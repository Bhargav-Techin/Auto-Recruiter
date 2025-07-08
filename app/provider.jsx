"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { supabase } from '@/services/supabaseClient'
import React, { useEffect, useState, useContext } from 'react'

function Provider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // Add loading state

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                createNewUser(user);
            } else {
                setLoading(false); // No user, stop loading
            }
        }).catch(error => {
            console.error("Error fetching user:", error)
            setLoading(false); // Error occurred, stop loading
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email)
                
                if (session?.user) {
                    await createNewUser(session.user);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, []);

    const createNewUser = async (authUser) => {
        try {
            setLoading(true); // Start loading when creating/fetching user
            
            let { data: Users, error } = await supabase
                .from('Users')
                .select("*")
                .eq('email', authUser.email);

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            if (Users?.length === 0) {
                const { data, error: insertError } = await supabase
                    .from('Users')
                    .insert([{
                        name: authUser?.user_metadata?.name,
                        email: authUser?.email,
                        picture: authUser?.user_metadata?.picture,
                    }])
                    .select();

                if (insertError) {
                    console.error(insertError);
                    setLoading(false);
                } else {
                    console.log("New user created:", data[0]);
                    setUser(data[0]);
                    setLoading(false);
                }
            } else {
                console.log("User already exists:", Users[0]);
                setUser(Users[0]);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error in createNewUser:", error);
            setLoading(false);
        }
    }

    return (
        <UserDetailContext.Provider value={{ user, setUser, loading }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

export const useUser = () => {
    const context = useContext(UserDetailContext);
    if (!context) {
        throw new Error('useUser must be used within a Provider');
    }
    return context;
}