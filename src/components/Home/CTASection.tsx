
import ctaBgImage from "../../assets/home/cta-bg.png";

export const CTASection = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up">
      <div className="relative overflow-hidden">
        <img
          src={ctaBgImage}
          alt="Doctor with digital tablet"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="mx-auto container px-5">
          <div className="relative flex min-h-[300px] md:min-h-[340px] flex-col lg:flex-row justify-center gap-8 px-8 py-10 md:items-center md:justify-between md:px-12 text-center lg:text-left">
            <div className="max-w-2xl" data-aos="fade-right">
              <h2 className="font-sora text-[38px] font-asemibold leading-tight text-white md:text-[54px]">
                Trusted. Verified.

                <span className="font-pattaya font-normal"> Secure..</span>
              </h2>

              <p className="mt-4 font-sora text-[16px] font-light leading-relaxed text-white/95">
                All mentors and content creators are verified professionals. ZYURA is designed to keep your data, progress, and educational materials protected and private.
              </p>
            </div>

            <button
              type="button"
              className=" rounded-xl border border-white/85 px-4 lg:px-8 py-3 lg:py-3.5 text-[14px] lg:text-base font-light text-white transition hover:bg-white/10"
              data-aos="fade-left"
              data-aos-delay="120"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
