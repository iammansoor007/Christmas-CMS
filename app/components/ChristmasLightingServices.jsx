// components/AwardWinningServicesSection.jsx
"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";

const AwardWinningServicesSection = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const [data, setData] = useState({
    badge: 'Premium Services',
    title: 'Services',
    subtitle: 'Loading...',
    items: []
  });

  useEffect(() => {
    setIsClient(true);
    const load = async () => {
      try {
        const [homeRes, servicesRes] = await Promise.all([
          fetch('/api/homepage', { cache: 'no-store' }),
          fetch('/api/services?limit=10&status=active', { cache: 'no-store' })
        ]);
        const homeD = await homeRes.json();
        const servicesD = await servicesRes.json();
        setData({
          badge: homeD.content?.services?.badge || 'Premium Services',
          title: homeD.content?.services?.title?.text || 'Services',
          subtitle: homeD.content?.services?.subtitle || 'Our lighting collection',
          items: servicesD.services || []
        });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const { badge, title: apiTitle, subtitle, items: services } = data;

  // Fixed positions for floating lights - NO RANDOM
  const floatingLights = [
    { left: 5, top: 10, color: '#f59e0b' },  // amber
    { left: 15, top: 25, color: '#ef4444' },  // red
    { left: 25, top: 40, color: '#10b981' },  // emerald
    { left: 35, top: 55, color: '#f59e0b' },
    { left: 45, top: 70, color: '#ef4444' },
    { left: 55, top: 85, color: '#10b981' },
    { left: 65, top: 15, color: '#f59e0b' },
    { left: 75, top: 30, color: '#ef4444' },
    { left: 85, top: 45, color: '#10b981' },
    { left: 95, top: 60, color: '#f59e0b' },
    { left: 10, top: 75, color: '#ef4444' },
    { left: 20, top: 90, color: '#10b981' },
    { left: 30, top: 5, color: '#f59e0b' },
    { left: 40, top: 20, color: '#ef4444' },
    { left: 50, top: 35, color: '#10b981' },
  ];

  // Fixed animation durations - NO RANDOM
  const animationDelays = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8];
  const animationDurations = [4, 5, 6, 7, 8, 4, 5, 6, 7, 8, 4, 5, 6, 7, 8];

  // Generate URL-friendly slug from service title
  const getServiceUrl = (service) => {
    const slugSource = service?.slug || service?.title || '';
    const slug = slugSource
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return slug ? `/services/${slug}` : '/services';
  };

  // Card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 30px 40px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(245,158,11,0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-8 xl:py-6"
    >
      {/* Light theme background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#fcd34d20_1px,transparent_1px)] bg-[length:24px_24px] xs:bg-[length:28px_28px] sm:bg-[length:32px_32px]" />
        <div className="absolute top-0 left-0 right-0 h-32 xs:h-40 sm:h-48 lg:h-64 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 xs:h-40 sm:h-48 lg:h-64 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Decorative light elements */}
      <div className="absolute top-20 left-5 xs:left-10 w-40 xs:w-56 sm:w-72 lg:w-96 h-40 xs:h-56 sm:h-72 lg:h-96 bg-amber-200/30 rounded-full blur-2xl xs:blur-3xl" />
      <div className="absolute bottom-20 right-5 xs:right-10 w-48 xs:w-64 sm:w-80 lg:w-[500px] h-48 xs:h-64 sm:h-80 lg:h-[500px] bg-red-200/30 rounded-full blur-2xl xs:blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xs:w-[350px] sm:w-[400px] lg:w-[500px] h-[280px] xs:h-[350px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r from-amber-100/30 to-red-100/30 rounded-full blur-2xl xs:blur-3xl" />

      {/* Floating Christmas lights - FIXED with no random values */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingLights.map((light, i) => (
            <motion.div
              key={i}
              className="absolute w-1 xs:w-1.5 h-1 xs:h-1.5 rounded-full"
              style={{
                left: `${light.left}%`,
                top: `${light.top}%`,
                background: light.color,
                opacity: 0.2,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: animationDurations[i],
                repeat: Infinity,
                delay: animationDelays[i],
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 xs:mb-10 sm:mb-14 lg:mb-16 xl:mb-20"
        >
          {/* Premium badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-3 px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 bg-white shadow-lg rounded-full border border-amber-200/50 mb-4 xs:mb-5 sm:mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <GiSparkles className="text-amber-500 text-xs xs:text-sm sm:text-base lg:text-lg" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em]">
              {badge}
            </span>
            <FaIcons.FaCrown className="text-amber-500 text-[10px] xs:text-xs sm:text-sm" />
          </motion.div>

          {/* Title */}
          <h2 className="text-center font-montserrat text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
              {apiTitle}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 font-montserrat text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed font-light px-3 xs:px-4">
            <span className="font-bold ">{subtitle}</span>
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 xl:gap-10">
          {services.map((service, index) => {
            const IconComponent = FaIcons[service.icon] || FaIcons.FaStar;
            const serviceUrl = getServiceUrl(service);

            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover="hover"
                onHoverStart={() => setActiveIndex(index)}
                onHoverEnd={() => setActiveIndex(null)}
                className="group relative h-full"
              >
                {/* Make the entire card clickable */}
                <Link href={serviceUrl} className="block h-full">
                  <div className="relative bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-lg xs:shadow-xl overflow-hidden border border-gray-100 h-full min-h-[380px] xs:min-h-[400px] sm:min-h-[420px] lg:min-h-[440px] xl:min-h-[460px] flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl">

                    {/* Top color bar */}
                    <motion.div
                      className="h-1 xs:h-1.5 sm:h-2 w-full flex-shrink-0"
                      style={{ backgroundColor: service.color }}
                      animate={activeIndex === index ? { height: "4px" } : { height: "2px" }}
                    />

                    {/* Image + Content row */}
                    <div className="flex flex-col sm:flex-row flex-1">
                      {/* Image section */}
                      <div className="sm:w-2/5 w-full">
                        <div className="relative w-full h-48 xs:h-52 sm:h-full min-h-[180px] sm:min-h-full overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                      </div>

                      {/* Content section */}
                      <div className="flex-1 p-3 xs:p-4 sm:p-5 lg:p-6 xl:p-8 overflow-y-auto">
                        {/* Icon and title row */}
                        <div className="flex items-start gap-2 xs:gap-3 sm:gap-4 mb-2 xs:mb-3 sm:mb-4">
                          <motion.div
                            className="w-8 xs:w-10 sm:w-12 h-8 xs:h-10 sm:h-12 rounded-lg xs:rounded-xl flex items-center justify-center text-sm xs:text-base sm:text-lg shadow-md xs:shadow-lg flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${service.color}15, white)`,
                              color: service.color,
                              boxShadow: `0 5px 10px -5px ${service.color}80`
                            }}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {(() => {
                              if (typeof service.icon === 'string' && service.icon.trim().startsWith('<svg')) {
                                return <div dangerouslySetInnerHTML={{ __html: service.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full p-2" />;
                              }
                              const Icon = FaIcons[service.icon] || FaIcons.FaStar;
                              return <Icon />;
                            })()}
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 leading-tight">
                              {service.title}
                            </h3>
                            <motion.div
                              className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                              animate={activeIndex === index ? { scaleX: 1 } : { scaleX: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>

                          <span
                            className="text-base xs:text-lg sm:text-xl lg:text-2xl xl:text-4xl font-black opacity-10 flex-shrink-0"
                            style={{ color: service.color }}
                          >
                            {service.number}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-xs xs:text-sm sm:text-base mb-2 xs:mb-3 sm:mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 mb-3 xs:mb-4 sm:mb-5 lg:mb-6">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={isInView ? { opacity: 1, x: 0 } : {}}
                              transition={{ delay: index * 0.1 + idx * 0.1 }}
                              className="flex items-center gap-1 xs:gap-1.5 sm:gap-2"
                            >
                              <FaIcons.FaCheckCircle
                                className="text-xs xs:text-sm sm:text-base flex-shrink-0"
                                style={{ color: service.color }}
                                suppressHydrationWarning
                              />
                              <span className="text-gray-700 text-xs xs:text-sm sm:text-base">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <motion.div
                          className="relative w-full overflow-hidden rounded-lg xs:rounded-xl font-semibold text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${service.color}10, ${service.color}20)`,
                            color: service.color,
                            border: `1px solid ${service.color}30`
                          }}
                          whileHover={{
                            scale: 1.02,
                            background: `linear-gradient(135deg, ${service.color}20, ${service.color}30)`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>View Details</span>
                          <FaIcons.FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />

                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{
                              x: ['-100%', '100%']
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 xs:mt-10 sm:mt-12 lg:mt-14 xl:mt-16 text-center"
        >
          <Link href="/services">
            <motion.div
              className="group relative px-4 xs:px-6 sm:px-8 lg:px-10 py-2 xs:py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-amber-500 to-red-500 rounded-lg xs:rounded-xl text-white font-bold text-xs xs:text-sm sm:text-base lg:text-lg shadow-md xs:shadow-lg lg:shadow-xl cursor-pointer inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                <FaIcons.FaLightbulb className="text-yellow-200 text-xs xs:text-sm sm:text-base" />
                <span>View All Services</span>
                <FaIcons.FaStar className="text-yellow-200 text-xs xs:text-sm sm:text-base" />
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Custom breakpoint styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @media (max-width: 300px) {
          .text-\\[8px\\] {
            font-size: 6px !important;
          }
          .text-\\[10px\\] {
            font-size: 8px !important;
          }
          .text-xs {
            font-size: 0.6rem !important;
          }
          .gap-1 {
            gap: 0.15rem !important;
          }
          .p-3 {
            padding: 0.5rem !important;
          }
          .h-48 {
            height: 140px !important;
          }
          .min-h-\\[380px\\] {
            min-height: 320px !important;
          }
        }

        @media (max-width: 640px) {
          .sm\\:h-full {
            height: 200px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AwardWinningServicesSection;
