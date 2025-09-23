import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                email, password,
            });
            setMessage(`User created, ID: ${res.data.user}`);
        } catch (error) {
            setMessage(error.message?.data?.message || "registration failed");
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>Register</h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-4 rounded-xl py-4 border border-gray-300'></input>
                    <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-4 rounded-xl py-4 border border-gray-300'></input>
                    <button className='w-full font-semibold bg-green-600 hover:bg-green-700 transition dureation-200 text-white rounded-xl p-2'>Register</button>
                </form>
                {message && <p className='mt-4 text-center text-green-600 font-medium'>{message}</p>}

                <p className='mt-6 text-center text-gray-600 text-sm'>
                    Already have an account?{" "}
                    <a href='/login' className='text-green-600 font-semibold hover:underline'>Login</a>
                </p>
            </div>
        </div>
    )
}

export default Register;