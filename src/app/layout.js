import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'Studio 101 | Premium Content Creation Space',
  description: 'Built for creators, brands & real stories. Your production home for bringing visions to life.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Premium Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        {/* FontAwesome Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-[#F4F2EE] text-[#1A1A1A] font-sans antialiased overflow-x-hidden pt-20">
        
        <Navbar />
        
        {/* This renders the specific page content (Home, Booking, Contact) */}
        <main className="min-h-screen">
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}