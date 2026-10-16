"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal, RevealGroup, SplitWords } from "@/components/ui/Reveal";

const stories = [
  {
    name: "Amazon",
    founder: "Jeff Bezos",
    year: "1994",
    description: "Run from a cramped garage. Stock crashed 94% in 2001. Wall Street called it 'Amazon.bomb'.",
    struggle: "He cut costs to the bone, built AWS internally to survive, and proved every single analyst wrong.",
    image: "/images/founders/bezos.jpg",
  },
  {
    name: "Apple",
    founder: "Steve Jobs & Wozniak",
    year: "1976",
    description: "Started in a suburban garage building circuit boards by hand with almost zero capital.",
    struggle: "Jobs sold his VW bus, Wozniak sold his HP calculator — together they raised just $1,350 to start.",
    image: "/images/founders/jobs.jpg",
  },
  {
    name: "Facebook",
    founder: "Mark Zuckerberg",
    year: "2004",
    description: "Coded in a Harvard dorm room. Faced massive lawsuits from day one.",
    struggle: "Turned down a $1B acquisition offer from Yahoo when the company had almost no revenue.",
    image: "/images/founders/zuck.jpg",
  },
  {
    name: "Airbnb",
    founder: "Brian Chesky & Gebbia",
    year: "2008",
    description: "Renting air mattresses in their apartment to pay rent. Rejected by 15 investors.",
    struggle: "Maxed out credit cards. Sold 'Obama O's' cereal boxes just to keep servers alive.",
    image: "/images/founders/chesky.jpg",
  },
  {
    name: "SpaceX / Tesla",
    founder: "Elon Musk",
    year: "2008",
    description: "Tesla was bankrupt. First 3 SpaceX rockets exploded. Both companies near death.",
    struggle: "Split his last $30M between two dying companies. The 4th rocket launch was do-or-die.",
    image: "/images/founders/musk.jpg",
  },
  {
    name: "Disney",
    founder: "Walt Disney",
    year: "1923",
    description: "Fired for 'lacking imagination'. His first studio went bankrupt. Ate dog food to survive.",
    struggle: "His first hit character (Oswald) was legally stolen by his own distributor. He started over.",
    image: "/images/founders/disney.jpg",
  },
];

export function FounderStories() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full py-20 md:py-28 bg-mist">
      <div className="shell">
        <div className="max-w-2xl mb-12 md:mb-16">
          <Reveal effect="fade"><span className="tag tag-coral">Big things start small</span></Reveal>
          <SplitWords
            text="Every giant faced extinction."
            className="mt-4 text-4xl md:text-5xl font-bold text-ink leading-[1.05]"
          />
          <Reveal delay={0.2}>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed">
              Behind every trillion-dollar valuation is a story of bankruptcy, rejection, and sheer
              survival. Don&apos;t quit.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.09} effect="scale">
          {stories.map((story, idx) => {
            const isOpen = open === idx;
            return (
              <article
                key={story.name}
                className="surface surface-hover overflow-hidden flex flex-col group"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-teal-light shrink-0">
                    <img
                      src={story.image}
                      alt={story.founder}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold text-ink leading-tight truncate">
                        {story.name}
                      </h3>
                      <span className="tag tag-neutral shrink-0">Est. {story.year}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{story.founder}</p>
                  </div>
                </div>

                <p className="px-5 text-[15px] leading-relaxed text-ink-soft">
                  {story.description}
                </p>

                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="mt-4 mx-5 mb-5 inline-flex items-center justify-between gap-2 rounded-xl border border-line bg-mist px-4 py-2.5 text-sm font-medium text-teal hover:bg-teal-light transition-colors cursor-pointer"
                >
                  {isOpen ? "Hide how they survived" : "How they survived"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden border-t border-line bg-teal-light/60"
                    >
                      <p className="px-5 py-4 text-[15px] leading-relaxed text-teal-deep">
                        {story.struggle}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
