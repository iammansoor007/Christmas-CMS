'use client'
import { useState, useRef, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { getFAQData } from '../services/dataService'

const FAQSection = ({ items: propItems, title: propTitle }) => {
  const [openIndex, setOpenIndex] = useState(0)
  const [items, setItems] = useState(propItems || [])
  const [title, setTitle] = useState(propTitle || 'Questions & Answers')
  const contentRefs = useRef([])

  useEffect(() => {
    if (!propItems) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/homepage', { cache: 'no-store' });
          const data = await response.json();
          if (data.content?.faq) setItems(data.content.faq);
        } catch (error) {
          console.error("Failed to fetch FAQ data:", error);
        }
      };
      fetchData();
    } else {
      setItems(propItems);
    }
  }, [propItems]);

  const toggleAccordion = (index) => {
    const el = contentRefs.current[index]

    if (!el) return

    if (openIndex === index) {
      // Collapse
      const height = el.scrollHeight
      el.style.height = height + 'px'

      requestAnimationFrame(() => {
        el.style.height = '0px'
      })

      setOpenIndex(null)
    } else {
      // Close previous
      if (openIndex !== null && contentRefs.current[openIndex]) {
        const prev = contentRefs.current[openIndex]
        prev.style.height = prev.scrollHeight + 'px'
        requestAnimationFrame(() => {
          prev.style.height = '0px'
        })
      }

      // Open new
      el.style.height = el.scrollHeight + 'px'
      setOpenIndex(index)
    }
  }

  return (
    <section className="w-full bg-gray-50 py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h2 className="text-center font-montserrat text-4xl md:text-5xl font-extrabold mb-20">
          <span className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>

        <div className="space-y-6">
          {items.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-300 ${isOpen ? 'shadow-xl' : 'shadow-sm'
                  }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center text-left"
                >
                  {/* Icon Block */}
                  <div
                    className={`flex items-center justify-center w-16 h-16 shrink-0 transition-colors duration-300 ${isOpen ? 'bg-red-600' : 'bg-gray-900'
                      }`}
                  >
                    <FaPlus
                      className={`text-white text-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-45 scale-110' : ''
                        }`}
                    />
                  </div>

                  {/* Question */}
                  <div className="px-8 py-6">
                    <h3
                      className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${isOpen ? 'text-red-600' : 'text-gray-900'
                        }`}
                    >
                      {item.question}
                    </h3>
                  </div>
                </button>

                {/* Animation Container */}
                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="overflow-hidden transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ height: index === 0 ? 'auto' : 0 }}
                >
                  <div className="pl-24 pr-8 pb-8 text-gray-600 leading-relaxed text-base">
                    {item.answer}
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FAQSection
