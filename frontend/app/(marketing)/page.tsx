import HeroSection from "@/components/marketing/hero/HeroSection";
import FeaturesGrid from "@/components/marketing/features/FeaturesGrid";
import HowItWorks from "@/components/marketing/how-it-works/HowItWorks";
import SocialProof from "@/components/marketing/social-proof/SocialProof";
import PricingCards from "@/components/marketing/pricing/PricingCards";
import CTASection from "@/components/marketing/cta/CTASection";

export default function LandingPage() {
    return (
        <main>
            <HeroSection />
            <FeaturesGrid />
            <HowItWorks />
            <SocialProof />
            <PricingCards />
            <CTASection />
        </main>
    );
}
