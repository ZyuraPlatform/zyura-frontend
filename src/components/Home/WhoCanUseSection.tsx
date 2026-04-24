import whoBgImage from "../../assets/home/Who-Can-Use.jpg";

const audienceList = [
  "Medical Students (MBBS, MD, DO)",
  "Nursing Students (BSN, MSN)",
  "Dental Students (BDS, DDS)",
  "Pharmacy Students (B.Pharm, Pharm.D)",
  "Allied Health Professionals",
  "Educators, mentors, and clinical instructors",
];

export const WhoCanUseSection = () => {
  return (
    <section className="mt-25 lg:mt-36" data-aos="fade-up">
      <div className="relative mx-auto min-h-[520px] max-w-[1920px] overflow-hidden">
        <img
          src={whoBgImage}
          alt="Healthcare professionals collaborating"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#0c1f2a]/35" />

        <div className="relative flex min-h-[520px] items-end p-5 md:p-8 lg:items-center lg:justify-end lg:p-10">
          <article
            className="w-full rounded-[28px] bg-white/96 p-6 shadow-sm backdrop-blur-sm md:max-w-[580px] md:p-8 lg:max-w-[640px] lg:p-10"
            data-aos="fade-left"
          >
            <p className="font-sora text-[14px] font-semibold uppercase tracking-[0.1em] text-[#2f4854]">
              WHO IT&apos;S FOR
            </p>
            <h2 className="mx-auto text-left mt-3 font-sora text-xl md:text-2xl lg:text-[38px] font-semibold text-dark">
              Who Can Use ZYURA?
            </h2>

            <ul className="mt-6 space-y-3">
              {audienceList.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 mb-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 70}
                >
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-brand" />
                  <span className="font-sora text-[16px] leading-relaxed text-[#4d6070]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};
