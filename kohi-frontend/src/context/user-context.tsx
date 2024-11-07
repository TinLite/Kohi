import { getProfile } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import React, { useEffect } from "react";

export const UserContext = React.createContext<{
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}>({
    user: null,
    setUser: () => { }
});

export const UserProvider = ({ children, userData }: { children: React.ReactNode, userData?: User }) => {
    const [user, setUser] = React.useState<User | null>(userData ?? null);
    useEffect(() => {
        getProfile().then(setUser).catch(() => {
            localStorage.removeItem("backend_access_token")
        })
    }, []);
    console.log("UserProvider", user)
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}