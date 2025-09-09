import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowRight, Play } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-agriculture.jpg";

export function HeroSection() {
  const navigate = useNavigate();
  // const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto space-y-8">
          {/* Announcement Badge */}
          <div className="animate-fade-in">
            <Badge className="bg-secondary/10 text-secondary-foreground border-secondary/20 backdrop-blur-sm px-6 py-3 text-sm font-medium">
              🚀 Now with 95% AI Accuracy • Trusted by 50,000+ Farmers
            </Badge>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              Transform Your Farm with{" "}
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed">
              Get instant crop disease detection, real-time market insights, 
              and personalized farming recommendations - all powered by advanced AI 
              and available in your local language.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/diagnose")}
              className="w-full sm:w-auto group"
            >
              <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Disease Detection
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C150,120 350,0 600,20 C850,40 1050,100 1200,80 L1200,120 L0,120 Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}