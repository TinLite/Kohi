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
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}