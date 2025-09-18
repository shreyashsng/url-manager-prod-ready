import React, { useState } from 'react';
import axios from 'axios';

const UrlForm = () => {
    const [original, setOriginal] = useState("");
    const [shortUrl, setShortUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/urls`, {original}
            );
            setShortUrl(`${import.meta.env.VITE_API_URL}/urls/${res.data.shortCode}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='p-4 max-w-md mx-auto'>
            <form onSubmit={handleSubmit} className='flex gap-2'>
                <input className='border p-2 flex-1' placeholder='Enter your URL' value={original} onChange={(e) => setOriginal(e.target.value)} />
                <button className='bg-blue-600 text-white px-4 py-2 rounded'>Shorten</button>
            </form>

            {shortUrl && (
                <div className='mt-4'>
                    <p className='font-semibold'>Your short URL: </p>
                    <a href={shortUrl} target='_blank' className='text-blue-700 underline'>{shortUrl}</a>
                </div>
            )} 
        </div>
    )
}

export default UrlForm

