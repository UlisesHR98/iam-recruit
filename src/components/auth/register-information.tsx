"use client";

import { Star, Brain, TrendingUp } from "lucide-react";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

export default function RegisterInformation() {
  return (
    <div className="hidden md:flex relative flex-col justify-between p-6 lg:p-8 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden min-h-dvh">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GravityStarsBackground
          starsCount={100}
          starsSize={2.5}
          starsOpacity={0.9}
          glowIntensity={40}
          glowAnimation="ease"
          movementSpeed={0.4}
          mouseInfluence={250}
          mouseGravity="attract"
          gravityStrength={120}
          starsInteraction={true}
          starsInteractionType="bounce"
          className="absolute inset-0 text-white pointer-events-auto"
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent" />

        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/25 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 lg:mb-8">
          <span className="text-white font-semibold text-base lg:text-lg">
            I'AM Recruit
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
          Comienza a <span className="text-primary">reclutar</span> de forma
          inteligente
        </h2>
        <p className="text-base lg:text-lg text-slate-300 mb-6 lg:mb-8 max-w-md leading-relaxed">
          Únete a nuestra plataforma y transforma tu proceso de selección.
          Encuentra al candidato ideal en minutos, no en semanas.
        </p>

        <div className="flex flex-col gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-2 lg:gap-3">
            <TrendingUp className="size-4 lg:size-5 text-primary shrink-0" />
            <span className="text-sm lg:text-base text-white">
              Ahorra hasta 70% del tiempo en selección
            </span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Brain className="size-4 lg:size-5 text-primary shrink-0" />
            <span className="text-sm lg:text-base text-white">
              IA entrenada con datos del mercado mexicano
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-4 lg:size-5 fill-primary text-primary"
              />
            ))}
          </div>
          <span className="text-sm lg:text-base text-white font-medium">
            +2,500 empresas confían en nosotros
          </span>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
