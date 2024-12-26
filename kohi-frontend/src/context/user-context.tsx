import { getProfile } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import React, { useEffect } from "react";

export const UserContext = React.createContext<{
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    loginFormOpen: boolean,
    setLoginFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
    user: null,
    setUser: () => { },
    loginFormOpen: false,
    setLoginFormOpen: () => { }
});

export const UserProvider = ({ children, userData }: { children: React.ReactNode, userData?: User }) => {
    const [user, setUser] = React.useState<User | null>(userData ?? null);
    const [loginFormOpen, setLoginFormOpen] = React.useState(false);
    useEffect(() => {
        getProfile().then(setUser).catch(() => {
            localStorage.removeItem("backend_access_token")
        })
    }, []);
    console.log("UserProvider", user)
    return (
        <UserContext.Provider value={{ user, setUser, loginFormOpen, setLoginFormOpen }}>
            {children}
        </UserContext.Provider>
    )
}