"use client";

import { FireworksBackground } from "@/components/animate-ui/components/backgrounds/fireworks";

export default function LoginInformation() {
  return (
    <div className="hidden md:flex relative flex-col justify-between p-6 lg:p-8 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden min-h-dvh">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FireworksBackground
          population={1}
          color={[
            "hsl(262, 100%, 70%)", // Color primario más brillante (púrpura/azul)
            "hsl(50, 100%, 60%)", // Amarillo dorado brillante
            "hsl(200, 100%, 65%)", // Azul cielo brillante
            "hsl(280, 90%, 70%)", // Púrpura brillante
            "hsl(0, 100%, 65%)", // Rojo/coral brillante
          ]}
          fireworkSpeed={{ min: 5, max: 9 }}
          fireworkSize={{ min: 2, max: 4 }}
          particleSpeed={{ min: 3, max: 8 }}
          particleSize={{ min: 1.5, max: 4 }}
          className="absolute inset-0 pointer-events-auto"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] animate-pulse" />
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
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
