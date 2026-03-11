"use client";
import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const pathname = usePathname();
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setSettings(d.settings))
      .catch(err => console.error('Error fetching settings:', err))
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setMobileServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    {
      path: "/services",
      label: "Services",
      dropdown: [
        {
          path: "/services/residential-lighting",
          label: "Residential Lighting",
          description: "Custom home lighting solutions",
          icon: "🏠"
        },
        {
          path: "/services/commercial-lighting",
          label: "Commercial Lighting",
          description: "Professional business installations",
          icon: "🏢"
        },
        {
          path: "/services/permanent-lighting",
          label: "Permanent Lighting",
          description: "Year-round architectural lighting",
          icon: "✨"
        }
      ]
    },
    { path: "/gallery", label: "Gallery" },
    { path: "/service-area", label: "Service Area" },
    { path: "/contact", label: "Contact" },
  ];
  const navItems = settings?.navigation?.items?.length
    ? settings.navigation.items.map((item) => ({
      path: item.href,
      label: item.label,
      dropdown: item.dropdown?.length ? item.dropdown : null,
      exact: item.exact || false,
    }))
    : defaultNavItems;

  // Check if link is active
  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    if (path === "/") {
      return pathname === "/";
    }
    if (path === "/services") {
      return pathname.startsWith("/services") && pathname !== "/service-area";
    }
    return pathname.startsWith(path);
  };

  // Check if dropdown item is active
  const isDropdownItemActive = (path) => {
    return pathname === path;
  };

  // Handle dropdown hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 300);
  };

  // Toggle mobile services dropdown
  const toggleMobileServices = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileServicesOpen(!mobileServicesOpen);
  };

  return (
    <>
      {/* Floating Logo */}
      <div className="fixed left-4 sm:left-6 lg:left-8 xl:left-12 z-[60] pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto block"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
            <Image
              src={settings?.logo || "/images/mainlogo.png"}
              alt={`${settings?.companyName || "Luminous Holiday"} Logo`}
              fill
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navbar */}
      <nav
        ref={navbarRef}
        className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
            ? "bg-dark-navy/95 backdrop-blur-lg shadow-lg shadow-holiday-gold/10 py-2"
            : "bg-dark-navy/90 backdrop-blur-md py-3"
          }`}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between">
            {/* Empty div with original logo size for spacing */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18"></div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
              <div className="flex items-center space-x-1">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div
                      key={item.path}
                      className="relative"
                      ref={dropdownRef}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* FIXED: Changed from button to Link */}
                      <Link
                        href={item.path}
                        className={`relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group flex items-center gap-1.5 ${isActive(item.path)
                            ? "text-holiday-gold"
                            : "text-warm-white hover:text-holiday-gold"
                          }`}
                      >
                        <span className="relative z-10 whitespace-nowrap">
                          {item.label}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-all duration-300 ${servicesDropdownOpen
                              ? "rotate-180 text-holiday-gold"
                              : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        {isActive(item.path) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-holiday-red/10 to-holiday-gold/10 rounded-lg border border-holiday-gold/30"></div>
                        )}
                      </Link>

                      {/* Desktop Dropdown Menu */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 transition-all duration-300 transform origin-top ${servicesDropdownOpen
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                          }`}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-gradient-to-br from-holiday-gold/30 to-holiday-red/30 backdrop-blur-sm"></div>

                        <div className="relative bg-dark-navy/95 backdrop-blur-lg rounded-xl border border-holiday-gold/30 shadow-2xl shadow-black/60 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-holiday-red/5 via-holiday-gold/5 to-holiday-green/5 animate-gradient"></div>
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-holiday-gold to-transparent"></div>

                          <div className="relative p-2">
                            {item.dropdown.map((dropdownItem, index) => (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                className={`group/dropdown relative block rounded-lg transition-all duration-300 ${index !== item.dropdown.length - 1
                                    ? "mb-1"
                                    : ""
                                  }`}
                                onClick={() => setServicesDropdownOpen(false)}
                              >
                                <div
                                  className={`absolute inset-0 rounded-lg transition-all duration-500 ${isDropdownItemActive(dropdownItem.path)
                                      ? "bg-gradient-to-r from-holiday-red/20 to-holiday-gold/20"
                                      : "opacity-0 group-hover/dropdown:opacity-100 group-hover/dropdown:bg-gradient-to-r group-hover/dropdown:from-holiday-red/10 group-hover/dropdown:to-holiday-gold/10"
                                    }`}
                                ></div>

                                {isDropdownItemActive(dropdownItem.path) && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-holiday-gold to-holiday-red rounded-r-full"></div>
                                )}

                                <div className="relative flex items-start gap-3 p-3">
                                  <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${isDropdownItemActive(dropdownItem.path)
                                        ? "bg-gradient-to-br from-holiday-gold/20 to-holiday-red/20 text-holiday-gold"
                                        : "bg-dark-navy/50 group-hover/dropdown:bg-holiday-gold/10"
                                      }`}
                                  >
                                    {typeof dropdownItem.icon === 'string' && dropdownItem.icon.trim().startsWith('<svg') ? (
                                      <div dangerouslySetInnerHTML={{ __html: dropdownItem.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5" />
                                    ) : (
                                      dropdownItem.icon
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <div
                                      className={`text-sm font-semibold transition-colors duration-300 ${isDropdownItemActive(dropdownItem.path)
                                          ? "text-holiday-gold"
                                          : "text-warm-white group-hover/dropdown:text-holiday-gold"
                                        }`}
                                    >
                                      {dropdownItem.label}
                                    </div>
                                    <div className="text-xs text-warm-white/60 group-hover/dropdown:text-warm-white/80 transition-colors duration-300">
                                      {dropdownItem.description}
                                    </div>
                                  </div>

                                  <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover/dropdown:opacity-100 transition-opacity duration-300">
                                    <svg
                                      className="w-4 h-4 text-holiday-gold animate-pulse"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </div>
                                </div>

                                {index !== item.dropdown.length - 1 && (
                                  <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-holiday-gold/20 to-transparent"></div>
                                )}
                              </Link>
                            ))}
                          </div>

                          <div className="relative p-3 bg-gradient-to-r from-holiday-red/10 to-holiday-gold/10 border-t border-holiday-gold/20">
                            <p className="text-xs text-center text-warm-white/70">
                              <span className="text-holiday-gold font-semibold">
                                💡 Lighting experts
                              </span>{" "}
                              - Free consultation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group ${isActive(item.path)
                          ? "text-holiday-gold"
                          : "text-warm-white hover:text-holiday-gold"
                        }`}
                    >
                      <span className="relative z-10 whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive(item.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-holiday-red/10 to-holiday-gold/10 rounded-lg border border-holiday-gold/30"></div>
                      )}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-holiday-red/0 via-holiday-gold/0 to-holiday-green/0 group-hover:from-holiday-red/5 group-hover:via-holiday-gold/5 group-hover:to-holiday-green/5 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                    </Link>
                  ),
                )}
              </div>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <a
                href={`tel:${settings?.contact?.phone || "(614) 301-7100"}`}
                className="relative overflow-hidden group min-w-[140px] inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-holiday-red to-holiday-gold text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="truncate">Call Now {settings?.contact?.phone || "(614) 301-7100"}</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-holiday-red via-holiday-gold to-holiday-green opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  if (!isOpen) setMobileServicesOpen(false);
                }}
                className="relative w-10 h-10 flex flex-col items-center justify-center group"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <span className="sr-only">Menu</span>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                    }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${isOpen ? "opacity-0" : "opacity-100"
                    }`}
                ></div>
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 mt-1 ${isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                    }`}
                ></div>
                <div className="absolute inset-0 rounded-full bg-holiday-gold/0 group-hover:bg-holiday-gold/10 transition-colors duration-300"></div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
          >
            <div className="pt-4 pb-6 border-t border-holiday-gold/20">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.path} className="flex flex-col">
                      {/* Mobile Services Button */}
                      <button
                        onClick={toggleMobileServices}
                        className={`relative px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-between w-full ${isActive(item.path) || mobileServicesOpen
                            ? "text-holiday-gold bg-gradient-to-r from-holiday-red/5 to-holiday-gold/5 border border-holiday-gold/20"
                            : "text-warm-white hover:text-holiday-gold hover:bg-dark-navy/50"
                          }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <div className="flex items-center gap-2">
                          {isActive(item.path) && (
                            <div className="w-2 h-2 rounded-full bg-holiday-gold animate-pulse"></div>
                          )}
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Mobile Dropdown */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? "max-h-96 mt-2" : "max-h-0"
                          }`}
                      >
                        <div className="relative ml-4">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-holiday-gold/50 via-holiday-red/50 to-holiday-gold/50"></div>

                          <div className="pl-4 space-y-2">
                            {item.dropdown.map((dropdownItem, index) => (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                onClick={() => {
                                  setIsOpen(false);
                                  setMobileServicesOpen(false);
                                }}
                                className={`group relative block rounded-lg transition-all duration-300 overflow-hidden ${isDropdownItemActive(dropdownItem.path)
                                    ? "bg-gradient-to-r from-holiday-red/20 to-holiday-gold/20"
                                    : "hover:bg-dark-navy/50"
                                  }`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-holiday-red/0 via-holiday-gold/0 to-holiday-green/0 group-hover:from-holiday-red/10 group-hover:via-holiday-gold/10 group-hover:to-holiday-green/10 transition-all duration-500"></div>

                                {isDropdownItemActive(dropdownItem.path) && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-holiday-gold to-holiday-red rounded-r-full"></div>
                                )}

                                <div className="relative flex items-start gap-3 p-3">
                                  <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-300 ${isDropdownItemActive(dropdownItem.path)
                                        ? "bg-gradient-to-br from-holiday-gold/30 to-holiday-red/30 text-holiday-gold"
                                        : "bg-dark-navy/50 text-warm-white/70 group-hover:bg-holiday-gold/10 group-hover:text-holiday-gold"
                                      }`}
                                  >
                                    {typeof dropdownItem.icon === 'string' && dropdownItem.icon.trim().startsWith('<svg') ? (
                                      <div dangerouslySetInnerHTML={{ __html: dropdownItem.icon }} className="w-full h-full flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6" />
                                    ) : (
                                      dropdownItem.icon
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <div
                                      className={`text-sm font-semibold transition-colors duration-300 ${isDropdownItemActive(dropdownItem.path)
                                          ? "text-holiday-gold"
                                          : "text-warm-white group-hover:text-holiday-gold"
                                        }`}
                                    >
                                      {dropdownItem.label}
                                    </div>
                                    <div className="text-xs text-warm-white/60 group-hover:text-warm-white/80 transition-colors duration-300">
                                      {dropdownItem.description}
                                    </div>
                                  </div>

                                  <div
                                    className={`absolute top-1/2 right-3 -translate-y-1/2 transition-opacity duration-300 ${isDropdownItemActive(dropdownItem.path)
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                      }`}
                                  >
                                    <svg
                                      className="w-4 h-4 text-holiday-gold animate-pulse"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </div>
                                </div>

                                {index !== item.dropdown.length - 1 && (
                                  <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-holiday-gold/20 to-transparent"></div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`relative px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 group ${isActive(item.path)
                          ? "text-holiday-gold bg-gradient-to-r from-holiday-red/5 to-holiday-gold/5 border border-holiday-gold/20"
                          : "text-warm-white hover:text-holiday-gold hover:bg-dark-navy/50"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {isActive(item.path) && (
                          <div className="w-2 h-2 rounded-full bg-holiday-gold animate-pulse flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                    </Link>
                  ),
                )}

                {/* Mobile CTA Section */}
                <div className="pt-4 mt-2 border-t border-holiday-gold/20">
                  <Button
                    href={`tel:${settings?.contact?.phone || "(614) 301-7100"}`}
                    variant="primary"
                    className="w-full justify-center py-3 text-base"
                    onClick={(e) => {
                      setIsOpen(false);
                      setMobileServicesOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Call Now {settings?.contact?.phone || "(614) 301-7100"}
                    </span>
                  </Button>

                  <div className="mt-4 pt-4 border-t border-holiday-gold/10">
                    <div className="flex flex-col space-y-3 text-sm">
                      <a
                        href="mailto:info@luminousholiday.com"
                        className="flex items-center gap-2 text-warm-white/80 hover:text-holiday-gold transition-colors px-1 py-2 rounded-lg hover:bg-dark-navy/30"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">
                          info@luminousholiday.com
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-holiday-gold/30 to-transparent"></div>
      </nav>
    </>
  );
};

export default memo(Navbar);
