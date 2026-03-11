// components/ChristmasLightingSection.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Add this import
import {
  FaCheckCircle,
  FaClock
} from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import heroowner from "../../public/images/heroowner.jpg";

const ChristmasLightingSection = () => {
  const boxRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/homepage", { cache: "no-store" });
        const jsonData = await response.json();
        setData(jsonData.content);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  if (!data) {
    return (
      <section className="w-full min-h-[600px] flex items-center justify-center">
        <div className="text-base">Loading...</div>
      </section>
    );
  }

  const { hero, workShowcase } = data;

  return (
    <section ref={boxRef} className="relative w-full overflow-hidden bg-white py-12 md:py-16 lg:py-20">

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">

        {/* TWO DIV LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* LEFT DIV - TALL IMAGE for owner's vertical selfie */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <div className="relative pb-[100%] lg:pb-[110%]"> {/* Tall aspect ratio for vertical image */}
                  <Image
                    src={heroowner}
                    alt="Owner - Christmas Lights Over Columbus"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                

                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />
                <div className="absolute -top-3 -left-3 w-20 h-20 bg-rose-400/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>

          {/* RIGHT DIV - ONLY Heading, Paragraph, Features, CTA */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">

            {/* Heading */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
                <GiSparkles className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Premium Service</span>
              </div>

              <h2 className="text-left font-montserrat text-4xl md:text-5xl font-extrabold">
                <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                  {data.about?.title?.part1} {data.about?.title?.part2}
                </span>
              </h2>
            </div>

            {/* Paragraph - Dynamic */}
            <div className="space-y-4">
              <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                {data.about?.subtitle}
              </p>
            </div>


            {/* CTA - Clean buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    const section = document.getElementById("freequote");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="relative overflow-hidden group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg w-auto min-w-[140px] sm:min-w-[160px] md:min-w-[180px] cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">

                    <span>{hero?.cta?.subtext || "Get My Free Quote"}</span>

                  </span>

                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </button>

                <button
                  onClick={() => (window.location.href = "/gallery")}
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-300"
                >
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChristmasLightingSection;