
import PickYourPerfect from "../../assets/home/Pick-your-perfect-plan.png";

const plans = [
  {
    name: "Basic",
    features: "2 doctor consultations, parenting tips access",
    price: "$19",
  },
  {
    name: "Standard",
    features: "5 doctor consultations, nutrition plan, growth tracker",
    price: "$39",
  },
  {
    name: "Premium Plan",
    features: "5 doctor consultations, nutrition plan, growth tracker",
    price: "$49",
  },
];

export const PricingSection = () => {
  return (
    <section className="relative overflow-hidden py-25 lg:py-36" data-aos="fade-up" id="pricing">
      <img
        src={PickYourPerfect}
        alt="Medical professionals collaborating"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-y-0 left-0 w-[24%] bg-gradient-to-r from-black/65 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[24%] bg-gradient-to-l from-black/65 to-transparent" />

      <div className="relative mx-auto container px-5">
        <div
          className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px] "
          data-aos="fade-up"
        >
          <h2 className="mx-auto text-center font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-white">
            Pick your -{" "}
            <span className="font-pattaya font-normal italic">perfect plan</span>
          </h2>
        </div>

        <div className="hidden md:block" data-aos="fade-up" data-aos-delay="80">
          <div className="overflow-hidden rounded-xl border border-white/55 bg-white/12 backdrop-blur-md">
            <table className="w-full border-collapse">
              <thead className="bg-brand-gradient">
                <tr>
                  <th className="border-r border-white/55 px-6 py-9 text-center font-sora text-[24px] font-medium text-white">
                    Plan
                  </th>
                  <th className="border-r border-white/55 px-6 py-9 text-center font-sora text-[24px] font-medium text-white">
                    Features
                  </th>
                  <th className="border-r border-white/55 px-6 py-9 text-center font-sora text-[24px] font-medium text-white">
                    Price/Month
                  </th>
                  <th className="px-6 py-9 text-center font-sora text-[24px] font-medium text-white">
                    Enroll Now
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => (
                  <tr
                    key={plan.name}
                    className={index < plans.length - 1 ? "border-b border-white/55 hover:bg-white/10 transition-colors duration-300" : "hover:bg-white/10 transition-colors duration-300"}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                  >
                    <td className="border-r border-white/55 px-6 py-10 text-center font-sora font-light text-[18px] text-white">
                      {plan.name}
                    </td>
                    <td className="border-r border-white/55 px-6 py-10 text-center font-sora font-light text-[18px] leading-relaxed text-white">
                      {plan.features}
                    </td>
                    <td className="border-r border-white/55 px-6 py-10 text-center font-sora text-[32px] font-semibold text-white">
                      {plan.price}
                    </td>
                    <td className="px-6 py-10 text-center">
                      <button
                        type="button"
                        className="rounded-xl border border-white/85 px-4 lg:px-8 py-3 lg:py-3.5 text-[14px] lg:text-base font-light text-white transition hover:bg-white/10"
                      >
                        Enroll Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className="rounded-xl border border-white/50 bg-white/12 p-5 backdrop-blur-md max-w-96 mx-auto"
              data-aos="fade-up"
              data-aos-delay={index * 90}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="font-sora text-2xl font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="text-right font-sora text-xl font-semibold text-white">
                  {plan.price}
                  <span className="block text-sm font-normal text-white/85">
                    /month
                  </span>
                </p>
              </div>

              <p className="mb-5 font-sora text-[14px] leading-relaxed text-white/90">
                {plan.features}
              </p>

              <button
                type="button"
                className="w-full rounded-xl border border-white/85 px-4 lg:px-8 py-3 lg:py-3.5 text-[14px] lg:text-base font-light text-white transition hover:bg-white/10"
              >
                Enroll Now
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
