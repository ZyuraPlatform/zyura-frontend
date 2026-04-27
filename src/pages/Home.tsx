// import { Element } from "react-scroll";
// import AIToolSection from "@/components/Home/AIToolSection";
import HeroSection from "@/components/Home/HeroSection";
// import MentorSection from "@/components/Home/MentorSection";
// import StudyPlanSection from "@/components/Home/StudyPlanSection";
// import studyPlanImage from "@/assets/home/study_plan_image.png";
// import Tools from "@/components/Home/Tools";
 //import { ValueBanner } from "@/components/Home/ValueBanner";
import { FeatureCards } from "@/components/Home/FeatureCards";
import { AIFeaturesGrid } from "@/components/Home/AIFeaturesGrid";
import { StudyExamModeSection } from "@/components/Home/StudyExamModeSection";
import { ContentCredibilitySection } from "@/components/Home/ContentCredibilitySection";
import { PersonalGroupStudySection } from "@/components/Home/PersonalGroupStudySection";
import { SmartStudyPlannerSection } from "@/components/Home/SmartStudyPlannerSection";
import { BenefitsStripSection } from "@/components/Home/BenefitsStripSection";
import { PricingSection } from "@/components/Home/PricingSection";
import { AIStudySection } from "@/components/Home/AIStudySection";
import { WhoCanUseSection } from "@/components/Home/WhoCanUseSection";
import { MentorsSection } from "@/components/Home/MentorsSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { CTASection } from "@/components/Home/CTASection";
import Header from "@/components/Home/header"; 
import { Footer } from "@/components/Home/Footer";
import { DisclaimerPolicyPage } from "@/components/Home/DisclaimerPolicyPage";
import { PolicyHeader } from "@/components/Home/PolicyHeader";
import { CopyrightPolicyPage } from "@/components/Home/CopyrightPolicyPage";
import { CookiePolicyPage } from "@/components/Home/CookiePolicyPage";
import { RefundPolicyPage } from "@/components/Home/RefundPolicyPage";
import { TermsConditionsPage } from "@/components/Home/TermsConditionsPage";
import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect } from 'react'
import { WhyZyuraDifferent } from "@/components/Home/WhyZyuraDifferent";
import { BuiltForEveryProfessional } from "@/components/Home/BuiltForEveryProfessional";
import { LearnByDoingSection } from "@/components/Home/LearnByDoingSection";
import { TestimonialSection } from "@/components/Home/TestimonialSection";

const Home = () => {
   const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const isTermsPage = pathname === "/terms-and-conditions-zyura-e";
  const isRefundPage = pathname === "/refund-policy-zyura-edu";
  const isCookiePage = pathname === "/cookie-policy-zyura-e";
  const isCopyrightPage = pathname === "/copyright-policy-zyura-e";
  const isDisclaimerPage = pathname === "/disclaimer-policy-zyura-e";

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 40,
      easing: "ease-out-cubic",
    });
  }, []);

  if (isTermsPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <TermsConditionsPage />
        <Footer />
      </div>
    )
  }

  if (isRefundPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <RefundPolicyPage />
        <Footer />
      </div>
    )
  }

  if (isCookiePage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <CookiePolicyPage />
        <Footer />
      </div>
    )
  }

  if (isCopyrightPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <CopyrightPolicyPage />
        <Footer />
      </div>
    )
  }

  if (isDisclaimerPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <DisclaimerPolicyPage />
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Header />
      <HeroSection />
      <WhyZyuraDifferent/>
      <BuiltForEveryProfessional/>
      
      {/* <ValueBanner /> */}
      <FeatureCards />
      <LearnByDoingSection/>
      <AIFeaturesGrid />
      <StudyExamModeSection />
      <ContentCredibilitySection />
      <PersonalGroupStudySection />
      <SmartStudyPlannerSection />
      <BenefitsStripSection />
      <PricingSection />
      <AIStudySection />
      <WhoCanUseSection />
      
      <MentorsSection />
      <FAQSection />
      <TestimonialSection/>
      <CTASection />
      <Footer/>
    </>

    // <div className="bg-white">
    //   <Element name="hero">
    //     <HeroSection />
    //   </Element>

    //   <Element name="tools">
    //     <Tools />
    //   </Element>

    //   <Element name="study-plan">
    //     <StudyPlanSection
    //       title="Innovative AI Study plan for better Education."
    //       description="Every year, we change the lives of millions of students..."
    //       leftFeatures={[
    //         { text: "AI Generated Quiz" },
    //         { text: "MCQ Bank" },
    //         { text: "Downloads Notes" },
    //       ]}
    //       rightFeatures={[
    //         { text: "AI Create Flash Cards" },
    //         { text: "Case Study" },
    //         { text: "Medical AI" },
    //       ]}
    //       buttonText="Start Case"
    //       image={studyPlanImage}
    //     />
    //   </Element>

    //   <Element name="ai-tools">
    //     <AIToolSection />
    //   </Element>

    //   <Element name="mentors">
    //     <MentorSection />
    //   </Element>
    // </div>
  );
};

export default Home;
