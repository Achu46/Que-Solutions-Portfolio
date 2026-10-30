import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';

export default function PublicLayout({ children, settings }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-brand selection:text-white transition-colors duration-200">
      <Navbar settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp phone={settings?.phone || '7092490337'} />
    </div>
  );
}

