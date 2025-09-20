import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalClicks: 0,
        activeLinks:0,
    });
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/urls/my-urls`, {headers: {Authorization: `Bearer ${token}`}, withCredentials: true});
                console.log("Dashboard API response:", res.data);
                setStats(res.data.stats);
                setUrls(res.data.urls);
            } catch (error) {
                console.error("Error loading dashboard: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if(loading){
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <p className='text-gray-50'>Loading dashboard...</p>
            </div>
        )
    }

    return (
        <main className='min-h-screen flex flex-col'>
            <header className='px-6 py-4 flex items-center justify-between'>
                <h1 className='text-2xl'>Dashboard</h1>
                <nav className='flex'>
                    <ul className='flex gap-6 text-gray-600'>
                        <Link to={'/'}>Home</Link>

                    </ul>
                </nav>
            </header>

            <section className='p-6 grid gap-6 md:grid-cols-3'>
                <div className='p-6 rounded-xl shadow'>
                    <h2 className='text-lg font-semibold'>
                        Total shortened links
                    </h2>
                    <p className='mt-2 text-3xl font-bold'>{stats.totalLinks}</p>
                </div>
                <div className='p-6 rounded-xl shadow'>
                    <h2 className='text-lg font-semibold'>
                        Total Clicks
                    </h2>
                    <p className='mt-2 text-3xl font-bold'>{stats.totalClicks}</p>
                </div>
                <div className='p-6 rounded-xl shadow'>
                    <h2 className='text-lg font-semibold'>
                        Active Links
                    </h2>
                    <p className='mt-2 text-3xl font-bold'>{stats.activeLinks}</p>
                </div>
            </section>
        </main>
    )

}

export default Dashboard