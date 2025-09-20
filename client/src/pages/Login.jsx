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
        <div>
            <div>
                <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit' className='bg-green-600 text-white'>Login</button>
                </form>
                {error && <p className='text-center'>{error}</p>}
            </div>
        </div>
    )
}

export default Login;