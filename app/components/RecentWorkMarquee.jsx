// components/RefinedWorkShowcase.jsx
"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const RefinedWorkShowcase = () => {
  const containerRef = useRef(null);
  const [starPositions, setStarPositions] = useState([]);
  const [data, setData] = useState(null);
  const [marqueeItems, setMarqueeItems] = useState([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [homeRes, recentRes, galleryRes] = await Promise.all([
          fetch("/api/homepage", { cache: "no-store" }),
          fetch("/api/recent-work?limit=24&status=active", { cache: "no-store" }),
          fetch("/api/gallery?limit=24&status=active", { cache: "no-store" })
        ]);
        const homeD = await homeRes.json();
        const recentD = await recentRes.json();
        const galleryD = await galleryRes.json();
        setData(homeD.content);
        if (recentD.items?.length > 0) {
          setMarqueeItems(recentD.items.map(i => ({ src: i.image, title: i.title || "Recent work" })));
        } else if (galleryD.items?.length > 0) {
          setMarqueeItems(galleryD.items.map(i => ({ src: i.image, title: i.title || "Gallery image" })));
        } else {
          // Fallback if gallery and recent work are empty
          setMarqueeItems([
            { src: "/images/gallery1.jpg", title: "Gallery" },
            { src: "/images/gallery2.jpg", title: "Gallery" },
            { src: "/images/gallery3.jpg", title: "Gallery" },
            { src: "/images/gallery4.jpg", title: "Gallery" }
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // For infinite scroll, duplicate images multiple times
  const duplicatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  // Generate star positions on client side only
  useEffect(() => {
    const positions = Array(25)
      .fill(null)
      .map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: Math.random() > 0.5 ? "#FFD700" : "#FF0000",
        duration: 1 + Math.random() * 2,
      }));
    setStarPositions(positions);
  }, []);

  if (!data) {
    return (
      <section className="relative w-full min-h-[600px] sm:min-h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading showcase...</div>
        </div>
      </section>
    );
  }

  const { workShowcase } = data || {};
  const { badge, title, description, cta } = workShowcase || {};
  const safeTitle = {
    prefix: title?.prefix || "Our Holiday",
    main: title?.main || "Masterpieces",
  };
  const safeBadge = badge || "Featured Installations";
  const safeDescription = description || "Professional Christmas lighting installations that transform ordinary homes into magical holiday destinations";
  const safeCta = cta || "View Our Portfolio";

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy overflow-hidden">
      {/* Modern Background Patterns */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-navy via-dark-navy/95 to-dark-navy"></div>

        {/* Enhanced Background Gradients for Better Brightness */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-holiday-gold/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-holiday-red/20 via-transparent to-transparent"></div>

        {/* BRIGHTER Animated Christmas Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {starPositions.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: "3px",
                height: "3px",
                background: `radial-gradient(circle, ${star.color} 40%, transparent 60%)`,
                filter: "blur(1px)",
                animation: `twinkle ${star.duration}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div
        ref={containerRef}
        className="relative w-full h-auto min-h-[600px] sm:min-h-screen flex items-center justify-center overflow-hidden px-2 sm:px-4 py-8 sm:py-0"
      >
        {/* Marquee Background Layer - IMPROVED CLARITY AND BRIGHTNESS */}
        <div className="absolute inset-0 z-0">
          {/* Top Marquee - Right to Left */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[25vh] sm:h-[35%] md:h-[40%] flex"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                duration: 80,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              },
            }}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={`top-${index}`}
                className="relative flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[28vw] h-full px-1 sm:px-2 group"
              >
                <div className="relative w-full h-full overflow-hidden cursor-pointer rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  {/* HIGH QUALITY IMAGES with Better Clarity */}
                  <img
                    src={item.src}
                    alt={item.title || `Recent Work ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-100 group-hover:brightness-125 saturate-125 group-hover:saturate-200 contrast-105 group-hover:contrast-125"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image in case the gallery image doesn't exist
                      e.target.onerror = null;
                      e.target.src = `https://images.unsplash.com/photo-1575425187336-d5ec5d0a1451?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&h=600`;
                    }}
                  />

                  {/* GLOWING OVERLAY on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-holiday-gold/0 via-transparent to-holiday-red/0 group-hover:from-holiday-gold/10 group-hover:to-holiday-red/10 transition-all duration-500" />

                  {/* LIGHT GLOW Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-holiday-gold/20 via-transparent to-transparent blur-md" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-holiday-red/20 via-transparent to-transparent blur-md" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom Marquee - Left to Right */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-[25vh] sm:h-[35%] md:h-[40%] flex"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              x: {
                duration: 80,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              },
            }}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={`bottom-${index}`}
                className="relative flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[28vw] h-full px-1 sm:px-2 group"
              >
                <div className="relative w-full h-full overflow-hidden cursor-pointer rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  {/* HIGH QUALITY IMAGES with Better Clarity */}
                  <img
                    src={item.src}
                    alt={item.title || `Recent Work ${index + 15}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-100 group-hover:brightness-125 saturate-125 group-hover:saturate-200 contrast-105 group-hover:contrast-125"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image in case the gallery image doesn't exist
                      e.target.onerror = null;
                      e.target.src = `https://images.unsplash.com/photo-1575425187336-d5ec5d0a1451?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&h=600`;
                    }}
                  />

                  {/* GLOWING OVERLAY on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-holiday-red/0 via-transparent to-holiday-gold/0 group-hover:from-holiday-red/10 group-hover:to-holiday-gold/10 transition-all duration-500" />

                  {/* LIGHT GLOW Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-holiday-red/20 via-transparent to-transparent blur-md" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-holiday-gold/20 via-transparent to-transparent blur-md" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Enhanced Gradient Overlay for Better Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-dark-navy/30 to-dark-navy/80 pointer-events-none" />
        </div>

        {/* Text Content with Fixed CTA */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center pt-12 sm:pt-0">
          {/* Modern Badge with Holiday Colors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-holiday-red/20 via-holiday-gold/20 to-holiday-red/20 rounded-full backdrop-blur-md border border-holiday-gold/30 shadow-lg"
          >
            <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-holiday-red to-holiday-gold animate-pulse" />
            <span className="text-sm sm:text-xs font-semibold text-white uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              {safeBadge}
            </span>
            <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-holiday-gold to-holiday-red animate-pulse" />
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold text-white mb-4 sm:mb-6 leading-tight"
          >
            <span className="block tracking-tight font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {safeTitle.prefix}
            </span>
            <span className="block mt-2 sm:mt-2">
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-holiday-gold via-holiday-gold to-holiday-red bg-clip-text text-transparent">
                  {safeTitle.main}
                </span>
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-holiday-gold/30"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </span>
            </span>
          </motion.h1>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-100 font-montserrat text-lg sm:text-base md:text-lg max-w-sm sm:max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-2"
          >
            {safeDescription}
          </motion.p>

          {/* FIXED CTA Button - No longer takes full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="px-2"
          >
            <div className="group relative inline-block w-auto max-w-full">
              <button
                onClick={() => (window.location.href = "/gallery")}
                className="relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-holiday-red via-holiday-red to-holiday-gold text-white font-bold rounded-xl hover:rounded-2xl transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-holiday-red/30 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 text-base sm:text-base md:text-xl w-full sm:w-auto min-w-[280px] sm:min-w-0"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <span>{safeCta}</span>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>

              {/* Floating Sparkles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-4 sm:h-4 bg-holiday-gold rounded-full animate-ping opacity-50"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 sm:w-3 sm:h-3 bg-holiday-red rounded-full animate-ping opacity-50 delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            filter: brightness(1.5);
          }
        }

        /* Enhanced glow animation for images */
        .group:hover img {
          filter: brightness(1.25) saturate(2) contrast(1.25);
        }

        /* Smooth image scaling */
        img {
          transition:
            transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Responsive design for very small screens */
        @media (max-width: 400px) {
          .text-4xl {
            font-size: 2.5rem;
          }
          .text-lg {
            font-size: 1.125rem;
          }

          /* Adjust button for very small screens */
          .min-w-[280px] {
            min-width: 260px;
          }
          .px-6 {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .text-base {
            font-size: 0.9375rem;
          }
        }

        @media (max-width: 320px) {
          .text-4xl {
            font-size: 2.25rem;
          }
          .text-lg {
            font-size: 1rem;
          }
          .min-h-[600px] {
            min-height: 550px;
          }

          /* Further adjust button for 320px screens */
          .min-w-[280px] {
            min-width: 240px;
          }
          .px-6 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        /* Touch-friendly tap targets */
        button {
          min-height: 48px;
        }

        /* Optimize image quality */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        /* Prevent image distortion */
        @media (max-width: 768px) {
          img {
            object-fit: cover;
            object-position: center;
          }
        }
      `}</style>
    </section>
  );
};

export default RefinedWorkShowcase;
