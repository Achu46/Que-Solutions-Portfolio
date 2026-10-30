import React from 'react';
import Navbar from '../components/Navbar';
import FloatingGlassNav from '../components/common/FloatingGlassNav';
import Footer from '../components/Footer';

export default function PublicLayout({ children, settings }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-brand selection:text-white transition-colors duration-200">
      <Navbar settings={settings} />
      <main className="flex-grow pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pb-24">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingGlassNav settings={settings} />
    </div>
  );
}
