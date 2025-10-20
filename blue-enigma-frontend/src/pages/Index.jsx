import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Waves, Plane, MapPin, Compass } from "lucide-react";
import { BackgroundSlideshow } from "@/components/BackgroundSlideshow";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-10">
        <BackgroundSlideshow />
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
        {/* Logo & Brand */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ocean-deep to-teal-accent flex items-center justify-center shadow-large">
            <Waves className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-ocean-deep via-ocean-medium to-teal-accent bg-clip-text text-transparent">
            Blue Enigma
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered travel companion for unforgettable journeys
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
          <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-soft hover:shadow-medium transition-all">
            <Plane className="w-8 h-8 mx-auto mb-3 text-teal-accent" />
            <h3 className="font-semibold mb-2">Smart Planning</h3>
            <p className="text-sm text-gray-500">
              Get personalized travel recommendations
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-soft hover:shadow-medium transition-all">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-teal-accent" />
            <h3 className="font-semibold mb-2">Destination Insights</h3>
            <p className="text-sm text-gray-500">
              Discover hidden gems and local favorites
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-soft hover:shadow-medium transition-all">
            <Compass className="w-8 h-8 mx-auto mb-3 text-teal-accent" />
            <h3 className="font-semibold mb-2">24/7 Assistance</h3>
            <p className="text-sm text-gray-500">
              Always here to help plan your adventure
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link to="/chat">
            <Button className="h-14 px-8 text-lg rounded-xl bg-gradient-to-br from-ocean-deep to-teal-accent hover:opacity-90 shadow-large transition-all hover:scale-105">
              Let’s Chat
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Start your journey with AI-powered travel insights
        </p>
      </div>
    </div>
  );
};

export default Index;
