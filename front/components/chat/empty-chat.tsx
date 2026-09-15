"use client";

import { Apple, Flame, ImagePlus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodOrnaments } from "./food-ornaments";

const SUGGESTIONS = [
  {
    icon: Flame,
    prompt: "Quantas calorias tem essa refeição?",
  },
  {
    icon: Apple,
    prompt: "Identifique os alimentos desta imagem.",
  },
  {
    icon: Scale,
    prompt: "Essa refeição parece equilibrada?",
  },
];

type EmptyChatProps = {
  onSuggestion: (prompt: string) => void;
  onPickImage: () => void;
};

export function EmptyChat({ onSuggestion, onPickImage }: EmptyChatProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-2 py-8 text-center sm:py-10">
      <FoodOrnaments />

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-xs font-semibold tracking-[0.22em] text-leaf uppercase animate-fade-in">
          Análise de refeições por IA
        </p>

        <h1 className="mt-5 font-display text-[clamp(2.25rem,5vw,3.6rem)] leading-[1.06] font-semibold tracking-tight text-balance">
          Descubra o que tem
          <br />
          no seu prato.
          <br />
          <span className="font-normal italic">
            E quantas <span className="text-terracotta-deep">calorias</span> ele tem.
          </span>
        </h1>

        <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground animate-fade-in-slow">
          Envie uma foto da sua refeição, bebida ou embalagem — e converse sobre alimentos, porções
          e calorias.
        </p>

        <div className="mt-10 flex w-full max-w-xl flex-wrap items-center justify-center gap-2.5 animate-fade-in-slow">
          {SUGGESTIONS.map(({ icon: Icon, prompt }) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSuggestion(prompt)}
              className="flex items-center gap-2 rounded-full border border-border/90 bg-card/70 px-4 py-2 text-sm text-foreground/90 shadow-soft backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ring/40 hover:bg-card hover:text-foreground hover:shadow-lift focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 outline-none active:translate-y-0"
            >
              <Icon className="size-3.5 text-terracotta" aria-hidden="true" />
              {prompt}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={onPickImage}
          className="mt-8 h-10 gap-2 rounded-full px-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
        >
          <ImagePlus aria-hidden="true" />
          Enviar uma foto
        </Button>

        <p className="mt-10 text-xs text-muted-foreground">
          As fotos existem apenas durante a conversa — nada é salvo.
        </p>
      </div>
    </div>
  );
}
