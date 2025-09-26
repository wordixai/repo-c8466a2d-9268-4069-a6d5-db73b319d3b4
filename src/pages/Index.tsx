import { BirthdayHero } from '@/components/birthday/BirthdayHero';
import { BirthdayWishes } from '@/components/birthday/BirthdayWishes';

const Index = () => {
  return (
    <div className="min-h-screen">
      <BirthdayHero />
      <BirthdayWishes />
    </div>
  );
};

export default Index;