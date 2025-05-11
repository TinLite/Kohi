import { getProfile } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import React, { useEffect } from "react";

export const UserContext = React.createContext<{
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    loginFormOpen: boolean,
    setLoginFormOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isAuthenticating?: boolean
}>({
    user: null,
    setUser: () => { },
    loginFormOpen: false,
    setLoginFormOpen: () => { },
    isAuthenticating: false
});

export const UserProvider = ({ children, userData }: { children: React.ReactNode, userData?: User }) => {
    const [user, setUser] = React.useState<User | null>(userData ?? null);
    const [loginFormOpen, setLoginFormOpen] = React.useState(false);
    const [isAuthenticating, setIsAuthenticating] = React.useState(true);
    useEffect(() => {
        getProfile()
            .then(setUser)
            .catch(() => { })
            .finally(() => setIsAuthenticating(false))
    }, []);
    console.log("user", user);
    return (
        <UserContext.Provider value={{ user, setUser, loginFormOpen, setLoginFormOpen, isAuthenticating }}>
            {children}
        </UserContext.Provider>
    )
}