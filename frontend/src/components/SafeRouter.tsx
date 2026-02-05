import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export const SafeRoute = ({ children }: { children: React.ReactNode }) => {
    const { accessToken } = useAuthStore();
    return accessToken ? children : <Navigate to="/login" />;
};
