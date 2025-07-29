import { AuthData } from "@/model/AuthData";
import { useEffect, useState } from "react";

export function useAuthData() {
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

    useEffect(() => {
        if (!localStorage) {
            return;
        }

        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setAuthData(new AuthData(storedToken));
        }
    }, [localStorage]);

    const saveAuthData = (newAuthData: AuthData) => {
        setAuthData(newAuthData);
        if (localStorage) {
            localStorage.setItem('token', newAuthData.token);
        }
    };

    return { authData, saveAuthData };
}