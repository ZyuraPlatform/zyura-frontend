
 
import { Mouse } from "lucide-react";
import innovativeStudyImage from "../../assets/home/Innovative-AI-Study.png";

const studyCards = [
  {
    tag: "Smart AI Tutor",
    title: "AI Tutor",
    description:
      "Learn with an AI tutor that explains concepts clearly. Improve accuracy with guided step-by-step assistance.",
  },
  {
    tag: "Pharma AI Support",
    title: "Pharmaceutical Aid",
    description:
      "Understand pharmaceutical concepts with AI insights. Learn drug uses, mechanisms, and effects clearly.",
  },
  {
    tag: "Guided Problem Solving",
    title: "Question Aid",
    description:
      "Solve complex medical questions with structured guidance. Improve problem-solving with clear step-by-step solutions.",
  },
  {
    tag: "Detailed Explanations",
    title: "In-Depth Explanation",
    description:
      "Break down difficult topics into simple explanations. Strengthen concepts with detailed focused learning.",
  },
  {
    tag: "Clinical Insights",
    title: "Clinical Context",
    description:
      "Apply theory to real-world clinical scenarios. Build decision-making skills with practical learning.",
  },
  {
    tag: "USMLE-Style Practice",
    title: "USMLE Question Style",
    description:
      "Practice with AI-generated USMLE-style questions. Prepare effectively with real exam patterns.",
  },
];

export const AIStudySection = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up" id="about-us">
      <div className="mx-auto container px-5">
        <div className="grid gap-4 grid-rows-1 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl w-full overflow-hidden" data-aos="fade-right">
            <img
              src={innovativeStudyImage}
              alt="Students using a laptop for AI-powered study"
              className="h-full min-h-[360px] w-full object-cover lg:min-h-[860px]"
            />
          </div>

          <div
            className="rounded-2xl bg-[#d9e3f2] p-5 md:p-6 lg:p-8 w-full"
            data-aos="fade-left"
          >
            <p className="font-sora  text-[14px] lg:text-[20px] text-[#4f5a69]">AI-Powered Learning Platform</p>
            <h2 className="mt-2 mx-auto text-left font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-dark">
              Innovative AI Study for Medical -{" "}
              <span className="font-pattaya font-normal">Students</span>
            </h2>
            <p className="mt-4 max-w-2xl font-sora text-[14px] lg:text-[18px] leading-relaxed text-[#2c3442]">
              Every year, Zyura helps thousands of students learn smarter and
              achieve better results. Simplify complex topics with AI tools
              designed for faster understanding and retention.
            </p>

            <div className="relative mt-6">
              <div className="study-scroll max-h-[620px] space-y-4 overflow-y-auto pr-2 md:pr-3">
                {studyCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-xl bg-white p-5 md:p-6 last-of-type:mb-10"
                     
                  >
                    <span className="inline-flex rounded-full border border-[#8d939b] px-3 py-1 font-sora text-[10px] lg:text-[11px] text-[#666d76]">
                      {card.tag}
                    </span>
                    <h3 className="mt-7 lg:mt-[70px] font-sora text-2xl lg:text-[26px] font-bold leading-tight text-[#232831]">
                      {card.title}
                    </h3>
                    <p className="mt-3 font-sora text-[14px] lg:text-[18px] leading-relaxed text-[#2f3643]">
                      {card.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#d9e3f2] via-[#d9e3f2]/85 to-transparent" />
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-sora text-sm font-medium tracking-wide text-[#4e5a6b]">
                <Mouse />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
