import { Brain, Zap, Target } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules"; 

export const WhyZyuraDifferent = () => {
  const pillars = [
    {
      icon: Brain,
      title: "Clinical Thinking First",
      description:
        "Train your brain to think like a real clinician—not just memorize facts.",
    },
    {
      icon: Zap,
      title: "AI-Powered Personalization",
      description:
        "Your study plan, questions, and feedback adapt to your strengths and weaknesses.",
    },
    {
      icon: Target,
      title: "Real Exam & Clinical Simulation",
      description:
        "Practice under pressure with viva exams, case scenarios, and timed simulations.",
    },
  ];

  return (
    <section
      className="bg-brand-gradient  px-5 lg:px-5  py-10 flex items-center justify-center"
      data-aos="fade-up"
    >
      <div className="container mx-auto px-5 w-full">
        {/* Section Title */}
        <div className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px] aos-init aos-animate" data-aos="fade-up">
          <h2 className="mx-auto text-center font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-white">
            Why Zyura-E is Different
          </h2>
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination,Navigation, Autoplay]}
            slidesPerView={1}
            pagination={false}
            navigation = {false}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full pb-12"
          >
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <SwiperSlide key={index} className="flex justify-center">
                  <div className="flex flex-col items-center text-center group px-2">
                    {/* Icon Container */}
                    <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-all duration-300">
                      <Icon
                        size={40}
                        className="text-white group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="font-sora text-xl md:text-2xl font-bold text-white mb-3">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white leading-relaxed text-base">
                      {pillar.description}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group border border-white/20 rounded-lg p-6 transition-transform duration-300 hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Icon Container */}
                <div className="mb-6 h-28 w-28 flex items-center justify-center bg-white/10 p-4 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-all duration-300">
                  <Icon
                    size={40}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="font-sora text-xl md:text-2xl font-bold text-white mb-3">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-white leading-relaxed text-base">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
