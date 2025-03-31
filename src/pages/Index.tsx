
import PadelJourney from "@/components/PadelJourney";

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Decorative padel balls - positioned absolutely */}
      <div className="fixed top-20 right-[5%] w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/10 to-green-400/5 animate-pulse" style={{ animationDuration: '7s' }}></div>
      <div className="fixed bottom-40 left-[8%] w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/10 to-green-400/5 animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="fixed top-[35%] left-[3%] w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/10 to-green-400/5 animate-pulse" style={{ animationDuration: '8s' }}></div>
      
      <PadelJourney defaultTab="home" />
    </div>
  );
};

export default Index;
