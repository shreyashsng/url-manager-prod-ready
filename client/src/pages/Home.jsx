import React from 'react'
import UrlForm from '../components/UrlForm';

const Home = () => {
  return (
    <main className='min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200'>
        <header className='py-16 text-center'>
            <h1 className='text-5xl font-extrabold tracking-tight text-gray-900'>URL Shortner</h1>
            <p className='mt-4 text-lg text-gray-600 max-w-xl mx-auto'>Fast, reliable, production-grade link shortening.</p>
        </header>
        <section className='flex-1 flex flex-col items-center justify-center px-4'>
            <div className='w-full max-w-2xl'>
                <div className='bg-white p-6 wounded-2xl'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4 text-center'>Paste your longURL below</h2>
                    <UrlForm />
                </div>

                <div className='mt-12 grid sm:grid-cols-3 gap-6'>
                    <div className='p-6 bg-white rounded-xl hover:shadow-lg transition'>
                        <h3 className='font-semibold text-gray-800 mb-2'>⚡ Fast</h3>
                        <p className='text-gray-600 text-sm'>Instant redirects powered by optimized infrastructure.</p>
                    </div>
                    <div className='p-6 bg-white rounded-xl hover:shadow-lg transition'>
                        <h3 className='font-semibold text-gray-800 mb-2'>🔒 Reliable</h3>
                        <p className='text-gray-600 text-sm'>Production-grade uptime and secure link management.</p>
                    </div>
                    <div className='p-6 bg-white rounded-xl hover:shadow-lg transition'>
                        <h3 className='font-semibold text-gray-800 mb-2'>📊 Analytics</h3>
                        <p className='text-gray-600 text-sm'>Track clicks, referrers, and geolocation with ease.</p>
                    </div>
                </div>
            </div>
        </section>
        <footer className='py-6 text-center bg-white border-t'>
            {new Date().getFullYear()} URL Shortner. Made by Shreyash.
        </footer>
    </main>
  )
}

export default Home