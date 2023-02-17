import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import NotificationBanner from '../components/NotificationBanner';
import IPhone from '../assets/IPhone.svg';

export default function HomePage() {
  return (
    <div className=''>
      <NotificationBanner />
      <Navbar />
      <HeroSection />
      
      <img src={IPhone}/>
      
    </div>
  );
};
