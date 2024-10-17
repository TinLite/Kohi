import { getProfile } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import React from "react";

export const UserContext = React.createContext<{
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}>({
    user: null,
    setUser: () => { }
});

export const UserProvider = ({ children, userData }: { children: React.ReactNode, userData?: User }) => {
    const [user, setUser] = React.useState<User | null>(userData ?? null);
    getProfile().then(setUser).catch(() => {
        localStorage.removeItem("backend_access_token")
    })
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}