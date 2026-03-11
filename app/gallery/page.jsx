'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CallToAction from '../components/CallToAction';
import Link from 'next/link';
import {
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaClock,
  FaPhoneAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaPause,
  FaPlay,
  FaUser,
  FaEnvelope,
  FaHome,
  FaTree,
  FaCalendarAlt,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { GiFruitTree } from 'react-icons/gi';

// Import images
import gallery1 from '../../public/images/gallery1.jpg';
import gallery2 from '../../public/images/gallery2.jpg';
import gallery3 from '../../public/images/gallery3.jpg';
import gallery4 from '../../public/images/gallery4.jpg';
import gallery5 from '../../public/images/gallery5.jpg';
import gallery6 from '../../public/images/gallery6.jpg';
import gallery7 from '../../public/images/gallery7.jpg';
import gallery8 from '../../public/images/gallery8.jpg';
import gallery9 from '../../public/images/gallery9.jpg';
import gallery10 from '../../public/images/gallery10.jpg';
import gallery11 from '../../public/images/gallery11.jpg';
import gallery12 from '../../public/images/gallery12.jpg';
import gallery13 from '../../public/images/gallery13.jpg';
import gallery14 from '../../public/images/gallery14.jpg';

// TouchSwipeLightbox Component - Moved outside main component
const TouchSwipeLightbox = ({ selectedImage, setSelectedImage, filteredImages }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);

    if (isLeftSwipe && currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setSelectedImage(filteredImages[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && currentIndex < filteredImages.length - 1) {
        setSelectedImage(filteredImages[currentIndex + 1]);
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages, setSelectedImage]);

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedImage]);

  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Close Button - Top Right */}
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 z-30 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 active:bg-black/80 transition-all duration-200"
          aria-label="Close"
        >
          <FaTimes className="text-white text-xl" />
        </button>

        {/* Image Counter - Top Left */}
        {filteredImages.length > 1 && (
          <div className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
            <span className="text-white/90 text-sm font-medium">
              {currentIndex + 1} / {filteredImages.length}
            </span>
          </div>
        )}

        {/* Main Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="relative w-full max-w-6xl">
            {/* Loading Spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {/* Image */}
            <div className="relative w-full" style={{ height: 'min(80vh, 800px)' }}>
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                className={`object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="100vw"
                priority
                quality={100}
                onLoadingComplete={() => setImageLoaded(true)}
              />
            </div>

            {/* Image Info - Bottom Center with proper text wrapping */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 break-words pr-12">
                  {selectedImage.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-white/80">
                  <span className="text-sm sm:text-base">
                    {selectedImage.location}
                  </span>
                  <span className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></span>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex > 0) {
                  setSelectedImage(filteredImages[currentIndex - 1]);
                }
              }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full hidden md:flex items-center justify-center hover:bg-black/70 transition-all duration-200 ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-white text-xl" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex < filteredImages.length - 1) {
                  setSelectedImage(filteredImages[currentIndex + 1]);
                }
              }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full hidden md:flex items-center justify-center hover:bg-black/70 transition-all duration-200 ${currentIndex === filteredImages.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              disabled={currentIndex === filteredImages.length - 1}
              aria-label="Next image"
            >
              <FaChevronRight className="text-white text-xl" />
            </button>
          </>
        )}

        {/* Mobile Swipe Hint - Shows briefly then fades */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none md:hidden">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full animate-fade-out">
              <span className="text-white/80 text-xs">← swipe to navigate →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Gallery = () => {
  // State
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const heroRef = useRef(null);
  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const initialFocusRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    hearAbout: '',
    message: ''
  });

 

  // Time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  // Hear about options
  const hearOptions = [
    'Google Search',
    'Facebook',
    'Instagram',
    'Friend/Family Referral',
    'Previous Customer',
    'Radio Ad',
    'Other'
  ];

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery?limit=100', { cache: 'no-store' });
        const data = await res.json();
        if (data.items) {
          const mapped = data.items.map(item => ({
            id: item._id,
            src: item.image,
            title: item.title,
            category: (item.category || 'general').toLowerCase(),
            location: item.location || 'Columbus'
          }));
          setGalleryImages(mapped);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);



  // Filtered images
  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  // Create marquee array with 3x duplicates
  const marqueeImages = Array(3).fill(filteredImages).flat();

  // Navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);

  // Handle call click
  const handleCallClick = () => {
    window.location.href = 'tel:+16143017100';
  };

  // Handle modal open
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsSubmitted(false);
    setError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      serviceType: '',
      preferredDate: '',
      preferredTime: '',
      hearAbout: '',
      message: ''
    });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle wheel event for modal scrolling
  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.stopPropagation();
      }
    }
  };

  // Smooth parallax effect
  useEffect(() => {
    let rafId;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2) * 8;
        targetY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2) * 8;
      }
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      setMousePosition({ x: currentX, y: currentY });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Smooth scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Visibility handler for CTA
  useEffect(() => {
    const handleVisibility = () => {
      const ctaSection = document.getElementById('cta-section');
      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleVisibility, { passive: true });
    handleVisibility();

    return () => window.removeEventListener('scroll', handleVisibility);
  }, []);

  // Click outside modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isModalOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

  // Focus first input
  useEffect(() => {
    if (isModalOpen && initialFocusRef.current) {
      setTimeout(() => {
        initialFocusRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Initial mount
  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  // Autoplay carousel - slower
  useEffect(() => {
    let interval;
    if (autoplay && !isHovering && filteredImages.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay, isHovering, filteredImages.length]);

  // Reset slide on filter change
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

  if (!mounted) return null;

  // CTA Content
  const cta = {
    title: 'Ready to Create Your Own Masterpiece?',
    description: 'Let our expert team transform your property into a breathtaking holiday destination.',
    buttons: {
      primary: 'Call Us Now: (614) 301-7100',
      secondary: 'Request Consultation'
    }
  };

  return (
    <main className="overflow-x-hidden w-full bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center w-full overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="relative w-full h-full transition-transform duration-[50ms] ease-out will-change-transform"

          >
            <Image
              src="/images/hero-background2.jpg"
              alt="About Christmas Lights Over Columbus"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 via-gray-900/90 to-red-500/30"></div>
        </div>

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob-slow"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-red-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob-slow animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob-slow animation-delay-4000"></div>
        </div>

        {/* Scroll overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent transition-opacity duration-300"
          style={{ opacity: scrollProgress }}
        ></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-up">
              <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium tracking-wider">OUR PORTFOLIO</span>
            </div>

            <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              <span className="block animate-title-slide-up">
                HOLIDAY LIGHTING{' '}
              </span>
              <span className="block relative animate-title-slide-up animation-delay-200">
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-red-400 bg-[length:200%_200%] animate-gradient-x">
                    GALLERY
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-red-400/30 blur-3xl -z-10 scale-150"></span>
                </span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-up animation-delay-400">
              Explore our collection of stunning residential and commercial transformations
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-600">
              <button
                onClick={handleCallClick}
                className="relative overflow-hidden group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <HiOutlineSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Get My Free Quote</span>
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Gallery Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Top Marquee */}
          <div
            className="relative mb-3 sm:mb-4"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="overflow-hidden rounded-xl">
              <div className="flex gap-2 sm:gap-3 py-2 marquee-right">
                {marqueeImages.map((image, index) => (
                  <div
                    key={`top-${index}`}
                    className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-lg overflow-hidden shadow-sm cursor-pointer group flex-shrink-0 hover:shadow-lg transition-shadow duration-300"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2">
                        <p className="text-white text-[10px] sm:text-xs font-semibold truncate">{image.title}</p>
                        <p className="text-white/70 text-[8px] sm:text-[10px] truncate">{image.location}</p>
                      </div>
                    </div>
                    <div className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExpand className="text-white text-[6px] sm:text-[8px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Carousel */}
          <div className="relative w-full max-w-4xl mx-auto my-3 sm:my-4 px-2 sm:px-4">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl border-2 sm:border-4 border-white">
              {filteredImages.length > 0 && (
                <Image
                  src={filteredImages[currentSlide]?.src}
                  alt={filteredImages[currentSlide]?.title}
                  fill
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                  priority
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
                  {filteredImages[currentSlide]?.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">{filteredImages[currentSlide]?.location}</p>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 hover:scale-110"
              >
                <FaChevronLeft className="text-xs sm:text-sm" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 hover:scale-110"
              >
                <FaChevronRight className="text-xs sm:text-sm" />
              </button>

              <button
                onClick={() => setAutoplay(!autoplay)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-200 hover:scale-110"
              >
                {autoplay ? <FaPause className="text-xs sm:text-sm" /> : <FaPlay className="text-xs sm:text-sm" />}
              </button>

              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
                {filteredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 ${index === currentSlide
                      ? 'w-4 sm:w-6 h-1 sm:h-1.5 bg-white rounded-full'
                      : 'w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/50 rounded-full hover:bg-white/80 hover:scale-110'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Marquee */}
          <div
            className="relative mt-3 sm:mt-4"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="overflow-hidden rounded-xl">
              <div className="flex gap-2 sm:gap-3 py-2 marquee-left">
                {marqueeImages.map((image, index) => (
                  <div
                    key={`bottom-${index}`}
                    className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-lg overflow-hidden shadow-sm cursor-pointer group flex-shrink-0 hover:shadow-lg transition-shadow duration-300"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2">
                        <p className="text-white text-[10px] sm:text-xs font-semibold truncate">{image.title}</p>
                        <p className="text-white/70 text-[8px] sm:text-[10px] truncate">{image.location}</p>
                      </div>
                    </div>
                    <div className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExpand className="text-white text-[6px] sm:text-[8px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="sm:-mt-12 lg:-mt-24 sm:p-6  lg:p-12 bg-white"> <CallToAction /></section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <TouchSwipeLightbox
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          filteredImages={filteredImages}
        />
      )}

      {/* Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              aria-label="Close modal"
            >
              <FaTimes className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {isSubmitted ? (
              <div className="p-6 sm:p-8 text-center overflow-y-auto min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
                  <FaCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Consultation Scheduled!
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Thank you for scheduling a consultation. We'll contact you within 24 hours to confirm your appointment.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <GiFruitTree className="text-white text-xl sm:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Schedule Free Consultation</h3>
                      <p className="text-emerald-100 text-xs sm:text-sm">Christmas Lights Over Columbus</p>
                    </div>
                  </div>
                </div>

                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto p-4 sm:p-6"
                  onWheel={handleWheel}
                  style={{ maxHeight: 'calc(90vh - 120px)' }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {error && (
                      <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-xs sm:text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          <FaUser className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                          Full Name *
                        </label>
                        <input
                          ref={initialFocusRef}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-400"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          <FaEnvelope className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-400"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          <FaPhoneAlt className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-400"
                          placeholder="(614) 555-0123"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          <FaHome className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                          Service Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-400"
                          placeholder="123 Main St, Columbus, OH 43215"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          <FaTree className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                          Service Type *
                        </label>
                        <select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white"
                        >
                          <option value="">Select a service type</option>
                          {serviceTypes.map(type => (
                            <option key={type.value} value={type.value} className="text-gray-900">
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                            <FaCalendarAlt className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                            Date *
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-xs sm:text-base text-gray-900 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                            <FaClock className="inline mr-1.5 sm:mr-2 text-emerald-600 text-xs sm:text-sm" />
                            Time *
                          </label>
                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-xs sm:text-base text-gray-900 bg-white"
                          >
                            <option value="">Select</option>
                            {timeSlots.map(time => (
                              <option key={time} value={time} className="text-gray-900">{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          How did you hear about us?
                        </label>
                        <select
                          name="hearAbout"
                          value={formData.hearAbout}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white"
                        >
                          <option value="">Select an option</option>
                          {hearOptions.map(option => (
                            <option key={option} value={option} className="text-gray-900">{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                          Additional Details (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-400 resize-none"
                          placeholder="Tell us about your vision for your holiday display..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                          Scheduling...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                          Schedule Free Consultation
                        </span>
                      )}
                    </button>

                    <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
                      By submitting, you agree to be contacted by Christmas Lights Over Columbus.
                    </p>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marqueeRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes marqueeLeft {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .marquee-right {
          animation: marqueeRight 120s linear infinite;
          animation-play-state: running;
          width: fit-content;
          will-change: transform;
        }
        
        .marquee-left {
          animation: marqueeLeft 120s linear infinite;
          animation-play-state: running;
          width: fit-content;
          will-change: transform;
        }
        
        .marquee-right:hover,
        .marquee-left:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 640px) {
          .marquee-right {
            animation: marqueeRight 80s linear infinite;
          }
          
          .marquee-left {
            animation: marqueeLeft 80s linear infinite;
          }
        }
        
        @keyframes blob-slow {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob-slow {
          animation: blob-slow 15s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        @keyframes title-slide-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-title-slide-up {
          animation: title-slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes fade-out {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .animate-fade-out {
          animation: fade-out 3s ease-out forwards;
        }
        
        .will-change-transform {
          will-change: transform;
        }
        
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </main>
  );
};

export default Gallery;
