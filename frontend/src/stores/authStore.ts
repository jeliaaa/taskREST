// src/stores/authStore.ts
import { create } from "zustand";
import type { AxiosError } from "axios";
import { apiV1 } from "../utils/axios";

interface User {
    id: number;
    username: string;
    email: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    phone: string;
    password: string;
    repassword: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    fetchMe: () => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: localStorage.getItem("access"),
    refreshToken: localStorage.getItem("refresh"),
    isAuthenticated: !!localStorage.getItem("access"),

    fetchMe: async () => {
        try {
            const { data } = await apiV1.get("/auth/me/");
            set({ user: data });
        } catch {
            set({ user: null, isAuthenticated: false });
        }
    },
    login: async ({ username, password }) => {
        try {
            const { data } = await apiV1.post("/auth/login/", {
                username,
                password,
            });

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            console.log(data)

            set({
                user: data.user,
                accessToken: data.access,
                refreshToken: data.refresh,
                isAuthenticated: true,
            });
        } catch (err) {
            const error = err as AxiosError<{ detail: string }>;
            throw new Error(error.response?.data?.detail || "Login failed");
        }
    },

    register: async ({
        username,
        email,
        phone,
        password,
        repassword,
    }) => {
        try {
            const { data } = await apiV1.post("/auth/register/", {
                username,
                email,
                phone,
                password,
                repassword,
            });

            /**
             * IMPORTANT:
             * This assumes your backend returns tokens on register.
             * If it doesn't, REMOVE this part and redirect to /login instead.
             */
            if (data.access && data.refresh) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                set({
                    user: data.user,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                    isAuthenticated: true,
                });
            }
        } catch (err) {
            const error = err as AxiosError<{ detail: string } | Record<string, string[]>>;
            // Django serializer errors are usually object-shaped
            if (error.response?.data) {
                const firstError = Object.values(error.response.data)[0];
                throw new Error(
                    Array.isArray(firstError) ? firstError[0] : String(firstError)
                );
            }

            throw new Error("Registration failed");
        }
    },

    logout: () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    hydrate: () => {
        const access = localStorage.getItem("access");
        const refresh = localStorage.getItem("refresh");

        if (access && refresh) {
            set({
                accessToken: access,
                refreshToken: refresh,
                isAuthenticated: true,
            });
        }
    },
}));
