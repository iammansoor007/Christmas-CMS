'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaShieldAlt,
  FaClock,
  FaMedal
} from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import { HiOutlineSparkles } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [treesReady, setTreesReady] = useState(false);
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const leftTreeRef = useRef(null);
  const rightTreeRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);

    const load = async () => {
      try {
        const res = await fetch('/api/homepage', { cache: 'no-store' });
        const homeD = await res.json();
        setData(homeD.content);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    load();

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Check when trees are ready
  useEffect(() => {
    const checkTrees = () => {
      if (leftTreeRef.current && rightTreeRef.current) {
        console.log('Trees are ready!');
        setTreesReady(true);
      } else {
        console.log('Trees not ready yet, checking again...');
        setTimeout(checkTrees, 100);
      }
    };

    checkTrees();
  }, []);

  // Working scroll animation for trees - with reduced intensity
  useEffect(() => {
    if (!treesReady) {
      console.log('Waiting for trees to be ready...');
      return;
    }

    console.log('Tree refs found, setting up scroll animation');

    const handleScroll = () => {
      if (!heroRef.current || !leftTreeRef.current || !rightTreeRef.current) return;

      // Get the hero section's position
      const rect = heroRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress (0 to 1) as we scroll through the hero section
      const progress = Math.max(0, Math.min(1, -rect.top / (windowHeight * 0.8)));

      // REDUCED INTENSITY - 50% of original
      // Original was scale from 1 to 0.3 (70% reduction)
      // Now scale from 1 to 0.65 (35% reduction - half of original)
      const scale = 1 - (progress * 0.35); // Scale from 1 to 0.65

      // Original horizontal movement was -50px to +50px
      // Now reduced to -25px to +25px
      const leftX = -25 * progress; // Move left tree left (reduced from 50 to 25)
      const rightX = 25 * progress; // Move right tree right (reduced from 50 to 25)

      // Original opacity fade was from 1 to 0.7 (30% fade)
      // Now reduced to 1 to 0.85 (15% fade - half of original)
      const opacity = 1 - (progress * 0.15); // Slightly fade

      // Apply transforms to left tree
      if (leftTreeRef.current) {
        leftTreeRef.current.style.transform = `scale(${scale}) translateX(${leftX}px)`;
        leftTreeRef.current.style.opacity = opacity;
      }

      // Apply transforms to right tree
      if (rightTreeRef.current) {
        rightTreeRef.current.style.transform = `scale(${scale}) translateX(${rightX}px)`;
        rightTreeRef.current.style.opacity = opacity;
      }

      // Update scroll progress state if needed elsewhere
      setScrollProgress(progress);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Call once to set initial state
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [treesReady]);

  const handleCallClick = () => {
    const section = document.getElementById("freequote");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!data) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="loader">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <GiSparkles className="absolute inset-0 m-auto text-3xl text-yellow-300 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const { hero } = data;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
    >
      {/* Ultra-immersive background */}
      <div className="absolute inset-0 z-0">
        {/* Base Dynamic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url(${hero?.backgroundImage || '/images/hero-background.jpg'})`,
            filter: 'brightness(0.35)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e]/80 via-transparent to-[#0a0f1e]/80"></div>

        {/* Background Image */}
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60"></div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Particle grid */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px sm:50px 50px'
          }}></div>
        </div>

        {/* Dynamic light streaks */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent animate-scan"></div>
          <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-red-400/20 to-transparent animate-scan animation-delay-2000"></div>
        </div>
      </div>

      {/* Christmas Trees - Bottom Corners */}
      <div className="absolute bottom-0 left-0 z-40 pointer-events-none">
        <div
          ref={leftTreeRef}
          className="will-change-transform"
          style={{
            transformOrigin: 'bottom left',
            transform: 'scale(1) translateX(0px)',
            opacity: 1,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
          }}
        >
          <Image
            src="/images/leftbottom.png"
            alt="Christmas tree left"
            width={200}
            height={300}
            className="w-auto h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-contain"
            priority
          />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-40 pointer-events-none">
        <div
          ref={rightTreeRef}
          className="will-change-transform"
          style={{
            transformOrigin: 'bottom right',
            transform: 'scale(1) translateX(0px)',
            opacity: 1,
            transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
          }}
        >
          <Image
            src="/images/rightbottom.png"
            alt="Christmas tree right"
            width={200}
            height={300}
            className="w-auto h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-contain"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="container heroooo relative z-30 max-w-7xl mx-auto px-3 sm:px-4"
      >
        <div className="flex flex-col textdiv items-center justify-center text-center">

          {/* Main Title */}
          <h1 className="font-montserrat font-extrabold text-5xl xs:text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="block text-white/90 mb-1 sm:mb-2 animate-title-slide-up">
              {hero.title?.part1}
            </span>
            <span className="block relative animate-title-slide-up animation-delay-200">
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
                  {hero.title?.part2}
                </span> <br />
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
                  {hero.title?.part3}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-red-400/30 blur-3xl -z-10 scale-150"></span>
              </span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 animate-fade-up animation-delay-400 group">
            <span className="relative inline-block">
              {hero.subtitle}
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </span>
          </p>



          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up animation-delay-800 w-full px-4 sm:px-0">
            {/* Primary Button */}
            <Link
              href={hero.cta?.primary?.link || "#freequote"}
              className="relative overflow-hidden group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 min-w-[180px] sm:min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-yellow-200" />
                <span>{hero.cta?.primary?.text || hero.cta?.subtext || "Get My Free Quote"}</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>

            {/* Secondary Button */}
            {(hero.cta?.secondary?.text) && (
              <Link
                href={hero.cta.secondary.link || "/services"}
                className="relative overflow-hidden group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 min-w-[180px] sm:min-w-[200px]"
              >
                <span className="relative z-10">{hero.cta.secondary.text}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/20 sm:bg-white/30 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes titleSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientX {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-blob {
          animation: blob 10s infinite;
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-title-slide-up {
          animation: titleSlideUp 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradientX 3s ease infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }

        .will-change-transform {
          will-change: transform, opacity;
        }

        @media (min-width: 400px) {
          .xs\\:text-5xl {
            font-size: 3rem;
            line-height: 1.1;
          }
        }

        @media (max-width: 639px) {
          h1 {
            font-size: 2.5rem !important;
            line-height: 1.1 !important;
          }
        }

        @media (max-width: 380px) {
          h1 {
            font-size: 2rem !important;
          }
        }

        .loader {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default Hero;
