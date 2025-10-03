import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({onLogin}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {email, password});
            localStorage.setItem("token", res.data.token);
            onLogin?.(res.data.user);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>Welcome Back</h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-green-500 focus:outline-none'/>
                    <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-green-500 focus:outline-none'/>
                    <button type='submit' className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition duration-200 py-2 cursor-pointer'>Login</button>
                </form>
                {error && <p className='mt-4 text-center text-red-500 font-medium'>{error}</p>}

                <p className='mt-6 text-center text-gray-600 text-sm'>Dont't have an account?{" "}<a href='/register' className='text-green-600 font-semibold hover:underline'>Sign Up</a></p>
            </div>
        </div>
    )
}

export default Login;