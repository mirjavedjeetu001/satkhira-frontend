import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sliderApi } from '../services/api';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: slides = [] } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const response = await sliderApi.getAll();
      return response.data;
    },
  });

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to Satkhira
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover the beauty, culture, and opportunities of Satkhira District
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/upazilas" className="btn btn-lg bg-white text-primary-600 hover:bg-primary-50">
                Explore Upazilas
              </a>
              <a href="/tourist-places" className="btn btn-lg btn-outline border-white text-white hover:bg-white/10">
                Tourist Places
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>

          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl text-white">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h2>
                {slide.description && (
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && slide.linkUrl && (
                  <a
                    href={slide.linkUrl}
                    className="btn btn-lg bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
