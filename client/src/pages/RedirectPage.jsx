import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const backendRedirectUrl = (shortCode) => {
    const base = (import.meta.env.VITE_API_URL?.replace(/\/$/, ""));
    return `${base}/urls/${shortCode}`;
}

const RedirectPage = () => {
    const {shortCode} = useParams();

    useEffect(() => {
        if(!shortCode) return;
        const backendUrl = backendRedirectUrl(shortCode);

        window.location.replace(backendUrl);
    }, [shortCode]);

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <p className='text-gray-500'>Redirecting...</p>
        </div>
    )
}

export default RedirectPage