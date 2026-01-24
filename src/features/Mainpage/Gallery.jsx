import { useState, useEffect, useCallback } from 'react';
import styles from './Gallery.module.css';

const images = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.jpg',
  '9.jpg',
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex]);

  const prevImage = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === images.length - 1;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader}>
        <h1>Portfolio</h1>
        <div className={styles.imageCounter}>
          Image {currentIndex + 1} of {images.length}
        </div>
      </div>

      <div className={styles.imageDisplay}>
        <img
          src={`/src/assets/gallery/${images[currentIndex]}`}
          alt={`Gallery image ${currentIndex + 1}`}
        />
      </div>

      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={prevImage}
          disabled={isFirstImage}
        >
          ← Previous
        </button>
        <button
          className={styles.navButton}
          onClick={nextImage}
          disabled={isLastImage}
        >
          Next →
        </button>
      </div>

      <div className={styles.thumbnailStrip}>
        {images.map((img, index) => (
          <div
            key={img}
            className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={`/src/assets/gallery/${img}`}
              alt={`Thumbnail ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <div className={styles.shortcuts}>
        Use ← → arrow keys to navigate | Click thumbnails to jump to image
      </div>
    </div>
  );
}
