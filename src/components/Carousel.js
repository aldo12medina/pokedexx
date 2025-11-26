import React, { useEffect, useRef, useState } from 'react';

const Carousel = ({ items = [], interval = 3000, onChange }) => {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (onChange) onChange(active);
  }, [active, onChange]);

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const start = () => {
    stop();
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % Math.max(items.length, 1));
    }, interval);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const goTo = (index) => {
    setActive(index);
  };

  return (
    <div className="carousel" onMouseEnter={stop} onMouseLeave={start}>
      <div className="carousel-track" ref={trackRef} style={{ transform: `translateX(-${active * 100}%)` }}>
        {items.map((it, idx) => (
          <div className="carousel-slide" key={idx} aria-hidden={active !== idx}>
            <img src={it.imagen_url} alt={it.nombre} />
          </div>
        ))}
      </div>

      <div className="carousel-controls">
        <button className="carousel-prev" onClick={() => goTo((active - 1 + items.length) % items.length)}>&lt;</button>
        <div className="carousel-indicators">
          {items.map((_, i) => (
            <button key={i} className={`dot ${i === active ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Ir a ${i + 1}`} />
          ))}
        </div>
        <button className="carousel-next" onClick={() => goTo((active + 1) % items.length)}>&gt;</button>
      </div>
    </div>
  );
};

export default Carousel;
