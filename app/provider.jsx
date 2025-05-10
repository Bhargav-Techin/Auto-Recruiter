"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { supabase } from '@/services/supabaseClient'
import React, { useEffect, useState, useContext } from 'react'

function Provider({ children }) {

    const [user, setUser] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                createNewUser(user); // Pass the user
            }
        }).catch(error => {
            console.error("Error fetching user:", error)
        })
    }, []);


    const createNewUser = async (user) => {
        let { data: Users, error } = await supabase
            .from('Users')
            .select("*")
            .eq('email', user.email);

        if (error) {
            console.error(error);
            return;
        }

        if (Users?.length === 0) {
            const { data, error: insertError } = await supabase
                .from('Users')
                .insert([{
                    name: user?.user_metadata?.name,
                    email: user?.email,
                    picture: user?.user_metadata?.picture,
                }])
                .select();

            if (insertError) {
                console.error(insertError);
            } else {
                console.log("New user created:", data[0]);
                setUser(data[0]); // 👈 use `data[0]`, not `data`
            }
        } else {
            console.log("User already exists:", Users[0]);
            setUser(Users[0]);
        }
    }


    return (
        <UserDetailContext.Provider value={{ user, setUser }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
}