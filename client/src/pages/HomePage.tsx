import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import NotificationBanner from '../components/NotificationBanner';
import ComingSoonSection from '../components/ComingSoonSection';
import FAQSection from '../components/FAQSection';


export default function HomePage() {
  return (
    <div className=''>
      <NotificationBanner />
      <Navbar />
      <HeroSection />
      <ComingSoonSection />
      <FAQSection />

    </div>
  );
};
