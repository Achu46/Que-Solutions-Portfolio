import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ children, settings }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-brand selection:text-white transition-colors duration-200">
      <Navbar settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
