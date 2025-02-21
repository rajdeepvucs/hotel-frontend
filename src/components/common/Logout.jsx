import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Clear local storage
        localStorage.clear();
        
        // Clear all cookies
        document.cookie.split(";").forEach((cookie) => {
            const cookieName = cookie.split("=")[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Navigate to login page
        navigate('/login');
    }, [navigate]);

    return null; // No UI needed for logout component
}

export default Logout;
