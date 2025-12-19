"use client";

import { Star, Users } from "lucide-react";

export default function LoginInformation() {
  return (
    <div className="hidden md:flex relative flex-col justify-between p-6 lg:p-8 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden min-h-dvh">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q250,150 500,200 T1000,200"
            fill="none"
            stroke="url(#wave-gradient)"
            strokeWidth="2"
            className="text-primary"
          />
          <path
            d="M0,300 Q250,250 500,300 T1000,300"
            fill="none"
            stroke="url(#wave-gradient)"
            strokeWidth="2"
            className="text-primary"
          />
          <path
            d="M0,400 Q250,350 500,400 T1000,400"
            fill="none"
            stroke="url(#wave-gradient)"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 lg:mb-8">
          <div className="size-7 lg:size-8 rounded-lg bg-primary flex items-center justify-center">
            <Users className="size-4 lg:size-5 text-primary-foreground" />
          </div>
          <span className="text-white font-semibold text-base lg:text-lg">
            I'AM Recruit
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
          Filtra con <span className="text-primary">inteligencia</span>, no
          manualmente
        </h2>
        <p className="text-base lg:text-lg text-slate-300 mb-6 lg:mb-8 max-w-md leading-relaxed">
          Nuestro filtro inteligente impulsado por IA analiza miles de puntos de
          datos de candidatos para destacar automáticamente los perfiles que
          mejor se ajustan a tus requisitos específicos.
        </p>

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
            4.9/5 de más de 1,000 reclutadores
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
