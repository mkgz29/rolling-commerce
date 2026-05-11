import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hero1 from '../assets/1.jpg';
import hero2 from '../assets/2.jpg';
import hero3 from '../assets/3.jpg';

const SLIDE_INTERVAL_MS = 6000;

const heroSlides = [
  { id: 1, image: hero1 },
  { id: 2, image: hero2 },
  { id: 3, image: hero3 },
];

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((slideIndex) => (slideIndex + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (event, slideIndex) => {
    event.stopPropagation();
    setCurrentSlide(slideIndex);
  };

  const handleHeroClick = () => {
    navigate('/products');
  };

  return (
    <section className="hero-section hero-slider-section" aria-label="Promociones Tech Core">
      <button className="hero-slider-shell" type="button" onClick={handleHeroClick} aria-label="Ver productos">
        <div className="hero-slider-track">
          {heroSlides.map((slide, index) => (
            <div
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              key={slide.id}
              aria-hidden={index !== currentSlide}
            >
              <img
                src={slide.image}
                alt=""
                className="hero-slide-image"
                onError={(event) => {
                  event.currentTarget.classList.add('is-hidden');
                }}
              />
            </div>
          ))}
        </div>

        <div className="hero-slider-dots" aria-label="Seleccionar slide">
          {heroSlides.map((slide, index) => (
            <button
              className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
              type="button"
              key={slide.id}
              onClick={(event) => goToSlide(event, index)}
              aria-label={`Ir al slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : undefined}
            />
          ))}
        </div>
      </button>
    </section>
  );
}

export default HeroSection;
