import React from 'react';

const Carousel = () => {
  return (
    <div className="banner">
      <div className="slider" style={{ '--quantity': 7 }}>
        <div className="item" style={{ '--position': 1 }}>
          <a href="https://raikugame-v2.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku1.png" alt="raiku 1" />
          </a>
        </div>
        <div className="item" style={{ '--position': 2 }}>
          <a href="https://raikugame-v3.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku2.png" alt="raiku 2" />
          </a>
        </div>
        <div className="item" style={{ '--position': 3 }}>
          <a href="https://raikugame-v4.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku3.png" alt="raiku 3" />
          </a>
        </div>
        <div className="item" style={{ '--position': 4 }}>
          <a href="https://raikugame-v5.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku4.png" alt="raiku 4" />
          </a>
        </div>
        <div className="item" style={{ '--position': 5 }}>
          <a href="https://raikugame-v6.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku5.png" alt="raiku 5" />
          </a>
        </div>
        <div className="item" style={{ '--position': 6 }}>
          <a href="https://raiku-game-eta.vercel.app" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku6.png" alt="raiku 6" />
          </a>
        </div>
        <div className="item" style={{ '--position': 7 }}>
          <a href="https://raiku-card-game.vercel.app" target="_blank" rel="noopener noreferrer">
            <img src="/images/raiku7.png" alt="raiku 7" />
          </a>
        </div>
      </div>
      <div className="model"></div>
    </div>
  );
};

export default Carousel;
