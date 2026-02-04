// utils/cardEffects.js

/* ------------------------------------------
   3D PARALLAX FOLLOWING MOUSE
------------------------------------------- */
export function setup3DParallax(card) {
  const height = card.clientHeight;
  const width = card.clientWidth;

  const handleMove = (e) => {
    const x = e.layerX;
    const y = e.layerY;

    // Hitung rotasi
    const rotateY = ((x - width / 2) / width) * 12; 
    const rotateX = ((y - height / 2) / height) * -12;

    card.style.transform = `
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale(1.03)
    `;
  };

  const resetTransform = () => {
    card.style.transform = `
      rotateX(0deg) 
      rotateY(0deg)
      scale(1)
    `;
  };

  card.addEventListener("mousemove", handleMove);
  card.addEventListener("mouseleave", resetTransform);
}


/* ------------------------------------------
   MAGNETIC HOVER FOLLOW (sedikit narik)
------------------------------------------- */
export function setupMagnetic(card) {
  const strength = 20;

  const handleEnter = () => {
    card.style.transition = "transform 0.15s ease";
  };

  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    const moveX = (x / rect.width) * strength;
    const moveY = (y / rect.height) * strength;

    card.style.transform += ` translate(${moveX}px, ${moveY}px)`;
  };

  const reset = () => {
    card.style.transition = "transform 0.3s ease";
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  card.addEventListener("mouseenter", handleEnter);
  card.addEventListener("mousemove", handleMove);
  card.addEventListener("mouseleave", reset);
}
