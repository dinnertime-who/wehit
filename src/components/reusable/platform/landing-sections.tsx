"use client";

import {
  CheckCircle2,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Star,
} from "lucide-react";

export function LandingSections() {
  return (
    <>
      <WhyChooseUsSection />
      <LearningProcessSection />
      <SuccessStatsSection />
    </>
  );
}

function WhyChooseUsSection() {
  const features = [
    {
      icon: GraduationCap,
      title: "전문 강사진",
      description: "업계 최고의 전문가들이 직접 강의합니다",
    },
    {
      icon: BookOpen,
      title: "체계적인 커리큘럼",
      description: "단계별 학습으로 실력을 향상시킵니다",
    },
    {
      icon: Target,
      title: "실전 중심 교육",
      description: "이론보다 실무에 바로 적용 가능한 내용",
    },
    {
      icon: Award,
      title: "인증 수료증",
      description: "과정 완료 시 수료증을 발급해드립니다",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="app-container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            왜 우리를 선택해야 할까요?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            최고의 교육 경험을 제공하기 위해 노력합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LearningProcessSection() {
  const steps = [
    {
      step: 1,
      title: "강의 신청",
      description: "원하는 강의를 선택하고 신청합니다",
    },
    {
      step: 2,
      title: "학습 시작",
      description: "체계적인 커리큘럼에 따라 학습을 시작합니다",
    },
    {
      step: 3,
      title: "실습 및 과제",
      description: "이론을 바탕으로 실습과 과제를 진행합니다",
    },
    {
      step: 4,
      title: "수료 및 인증",
      description: "과정을 완료하고 수료증을 받습니다",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="app-container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            학습 과정
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            단계별로 체계적으로 학습할 수 있습니다
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-border">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessStatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "수강생",
      description: "누적 수강생 수",
    },
    {
      icon: Star,
      value: "4.8",
      label: "평균 평점",
      description: "수강생 만족도",
    },
    {
      icon: CheckCircle2,
      value: "95%",
      label: "수료율",
      description: "과정 완료율",
    },
    {
      icon: TrendingUp,
      value: "90%",
      label: "취업률",
      description: "수료 후 취업 성공률",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="app-container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            성공 사례
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            많은 분들이 우리와 함께 성장하고 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2 text-foreground">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

