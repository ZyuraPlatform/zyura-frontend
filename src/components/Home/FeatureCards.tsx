
import allInOneImage from "../../assets/home/All-in-One.png";
import access247Image from "../../assets/home/24x7-Access.png";
import SmartLearningTools from "../../assets/home/Smart-Learning-Tools.jpg";
import AdaptiveStudyExperience from "../../assets/home/Adaptive-Study-Experience.jpg";

const cards = [
  {
    tag: "Smart Tools",
    title: "Smart Learning Tools",
    image: SmartLearningTools,
    description:
      "Learn efficiently with AI-powered tools designed to simplify complex medical concepts and improve retention.",
    bg: "#F6F8E9",
  },
  {
    tag: "All-in-One",
    title: "Unified Study Platform",
    image: allInOneImage,
    description:
      "Learn efficiently with AI-powered tools designed to simplify complex medical concepts and improve retention.",
    bg: "#E9F8EF",
  },
  {
    tag: "Flexible Learning",
    title: "Adaptive Study Experience",
    image: AdaptiveStudyExperience,
    description:
      "Study anytime, anywhere at your own pace with tools that adjust to your learning style and schedule.",
    bg: "#E0EAF9",
  },
  {
    tag: "24/7 Access",
    title: "Learn Without Limits",
    description:
      "Get uninterrupted access to your study resources whenever you need on desktop or mobile devices anytime.",
    image: access247Image,
    bg: "#F8E9F3",
  },
];

export const FeatureCards = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up" id="tools">
      <div
        className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px] "
        data-aos="fade-up"
      >
        <h2 className="mx-auto text-center font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-dark">
          Because your success in medicine needs more than effort{" "}
          <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">
            it needs the right tools.
          </span>
        </h2>
      </div>
      <div className="mx-auto container px-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="flex min-h-auto lg:min-h-[460px] flex-col rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 90}
              style={{ backgroundColor: card.bg }}
            >
              <span className="inline-flex w-fit rounded-full border border-[#353b48]/40 px-3 py-1 text-xs font-medium text-[#49505c]">
                {card.tag}
              </span>

              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="mt-4 h-[220px] w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="mt-4 h-[220px]" />
              )}

              <h3 className="mt-6 font-sora text-xl lg:text-2xl leading-tight text-[#141923]">
                {card.title}
              </h3>
              <p className="mt-4 text-[12px] lg:text-[14px] leading-relaxed text-[#252b36]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
