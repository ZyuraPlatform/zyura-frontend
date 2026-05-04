import {
  GraduationCap,
  HeartPulse,
  Stethoscope,
  UserRoundCog,
  Users,
  ShieldPlus,
  BriefcaseMedical,
} from "lucide-react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const professionals = [
  { icon: Stethoscope, title: "Doctors & Physicians" },
  { icon: HeartPulse, title: "Nurses" },
  { icon: UserRoundCog, title: "Physiotherapists" },
  { icon: BriefcaseMedical, title: "Allied Health Professionals" },
  { icon: GraduationCap, title: "Medical & Healthcare Students" },
  { icon: ShieldPlus, title: "Clinical Educators & Institutions" },
  { icon: Users, title: "All Health Care Professionals" },
];

export const BuiltForEveryProfessional = () => {
  return (
    <section className="pt-20 lg:pt-28 pb-6" data-aos="fade-up" id="professionals">
      <div className="">
        <div className="relative py-24 overflow-hidden border border-[#DDEFF0] bg-gradient-to-br from-[#F2FAFA] via-[#F7FCFC] to-[#0a509f36]">
          <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[#2BAFA533] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[#6AC4E333] blur-3xl" />
          <div className="container px-5 mx-auto">
            <h2 className="mx-auto max-w-[920px] text-center font-sora text-2xl font-semibold text-dark md:text-3xl lg:text-[48px]">
              Built for the Entire{" "}
              <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">
                Healthcare Community
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] text-center font-sora text-[15px] leading-relaxed text-[#4A5A66] lg:text-[18px]">
              Zyura is designed for every stage of healthcare learning, practice, and teaching.
            </p>

            <div className="mt-10 overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="h-full"
              >
                {professionals.map((professional, index) => {
                  const Icon = professional.icon;
                  return (
                    <SwiperSlide key={professional.title} className="h-auto my-5">
                      <article
                        data-aos="fade-up"
                        data-aos-delay={index * 80}
                        className="group h-full rounded-2xl border border-[#E2EEEF] bg-white/90 p-5 shadow-[0_8px_24px_rgba(18,69,85,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(18,69,85,0.14)] text-center"
                      >
                        <div className="inline-flex rounded-full bg-brand-gradient p-3 text-white transition-transform duration-300 group-hover:scale-105 ">
                          <Icon size={22} />
                        </div>
                        <h3 className="mt-4 font-sora text-[17px] font-semibold leading-snug text-[#1D2A34] lg:text-[18px]">
                          {professional.title}
                        </h3>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
