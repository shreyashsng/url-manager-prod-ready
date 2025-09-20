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
        <div>
            <div>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button className='bg-green-600 text-white'>Register</button>
                </form>
                {message && <p className='text-center'>{message}</p>}
            </div>
        </div>
    )
}

export default Register;