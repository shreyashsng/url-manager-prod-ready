import React from 'react'
import UrlForm from '../components/UrlForm';

const Home = () => {
  return (
    <main className='min-h-screen bg-gray-50 flex flex-col'>
        <header className='py-10 bg-white shadow'>
            <h1 className='text-4xl font-bold text-center text-gray-800'>URL Shortner</h1>
            <p className='mt-2 text-center text-gray-600'>Fast, reliable, production-grade link shortening.</p>
        </header>
        <section className='flex-1 flex items-center justify-center'>
            <UrlForm />
        </section>
        <footer className='py-4 text-center text-gray-500 border-t'>
            {new Date().getFullYear()} URL Shortner. Made by Shreyash.
        </footer>
    </main>
  )
}

export default Home