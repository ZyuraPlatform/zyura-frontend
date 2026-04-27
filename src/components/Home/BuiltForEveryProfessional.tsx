import { Stethoscope, Heart, Pill, Smile, Users } from "lucide-react";

const professionals = [
    {
        icon: Stethoscope,
        title: "Medical Students",
        description: "Master concepts and pass exams",
        bg: "#F6F8E9",
        iconColor: "#4CAF50",
    },
    {
        icon: Users,
        title: "Doctors & Residents",
        description: "Strengthen clinical decision-making",
        bg: "#E9F8EF",
        iconColor: "#00897B",
    },
    {
        icon: Heart,
        title: "Nurses",
        description: "Improve patient care and clinical reasoning",
        bg: "#E0EAF9",
        iconColor: "#1976D2",
    },
    {
        icon: Pill,
        title: "Pharmacists",
        description: "Deepen drug knowledge and interactions",
        bg: "#F8E9F3",
        iconColor: "#C2185B",
    },
    {
        icon: Smile,
        title: "Dentists & Allied Health",
        description: "Connect theory with practice",
        bg: "#FFF8E1",
        iconColor: "#F57F17",
    },
];

export const BuiltForEveryProfessional = () => {
    return (
        <section className="pt-25 lg:pt-36" data-aos="fade-up" id="professionals">
            <div
                className="mx-auto mb-16 px-5 max-w-[900px]"
                data-aos="fade-up"
            >
                <h2 className="mx-auto text-center font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-dark">
                    Built for Every Medical <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">Professional</span>
                </h2>
            </div>

            <div className="mx-auto container px-5">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                    {professionals.map((professional, index) => {
                        const Icon = professional.icon;
                        return (
                            <article
                                key={professional.title}
                                className="flex min-h-[250px] flex-col justify-between rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                                data-aos="fade-up"
                                data-aos-delay={index * 90}
                                style={{ backgroundColor: professional.bg }}
                            >
                                {/* Icon Container */}
                                <div className="inline-flex w-fit rounded-full p-3 mb-4" style={{ backgroundColor: professional.iconColor + "20" }}>
                                    <Icon
                                        size={32}
                                        style={{ color: professional.iconColor }}
                                    />
                                </div>
                                <div>
                                    {/* Title */}
                                    <h3 className="font-sora text-xl lg:text-2xl leading-tight text-[#141923] font-semibold">
                                        {professional.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-3 text-[14px] lg:text-[15px] leading-relaxed text-[#4d6070] flex-grow">
                                        {professional.description}
                                    </p>

                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
