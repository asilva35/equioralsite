import React, { useEffect, useRef, useState } from 'react';
import ImageComp from '../ImageComp/ImageComp';
import styles from './Carousel.module.css';
import { NextFilledIcon, PrevFilledIcon } from '@virtel/icons';

export default function Carousel({ data, theme, edgeOffset = 0 }) {
  const carouselRef = useRef();
  const wrapperRef = useRef();
  const circlesMarksRef = useRef();
  const [currentPos, setCurrentPos] = useState();
  const [clientX, setClientX] = useState();
  const [compWidth, setCompWidth] = useState();
  const [carouselWidth, setCarouselWidth] = useState();
  const [translateValue, setTranslateValue] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState();
  const [showPreNav, setShowPreNav] = useState(false);
  const [showNextNav, setShowNextNav] = useState(false);
  const [startingSwipe, setStartingSwipe] = useState(false);
  const [maxDistance, setMaxDistance] = useState(0);
  const [minDistance, setMinDistance] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(1);
  const [navigationMethod, setNavigationMethod] = useState('touch');

  const getWidthRef = (elem) => {
    return elem.current.getBoundingClientRect().width;
  };

  const getLeftRef = (elem) => {
    return elem.current.getBoundingClientRect().left;
  };

  useEffect(() => {
    if (!window) return;
    if (!wrapperRef.current) return;
    setNavigationMethod(window.screen.width > 1199 ? 'click' : 'touch');
    setMaxDistance(
      (getWidthRef(wrapperRef) - (getWidthRef(carouselRef) - edgeOffset)) * -1
    );
    setMinDistance(0);
    setCompWidth(getWidthRef(wrapperRef));
    setCarouselWidth(getWidthRef(carouselRef));
    setTotalSlides(data.length || 0);
  }, []);

  const onTouchStart = (e) => {
    if (navigationMethod !== 'touch') return;
    setClientX(e.touches[0].clientX);
    setStartingSwipe(true);
  };
  const onTouchMove = (e) => {
    if (navigationMethod !== 'touch') return;
    if (!startingSwipe) return;
    const position = e.nativeEvent.touches
      ? e.nativeEvent.touches[0].clientX
      : e.nativeEvent.clientX;
    const distance = position - clientX;
    swipe(currentPos + distance);
    setSwipeDirection(distance < 0 ? 'left' : 'right');
  };

  const onTouchEnd = (e) => {
    if (navigationMethod !== 'touch') return;
    setStartingSwipe(false);
    swipeComplete();
  };

  useEffect(() => {
    setShowNextNav(
      navigationMethod === 'click' &&
        translateValue > maxDistance &&
        compWidth > carouselWidth
    );
    setShowPreNav(navigationMethod === 'click' && translateValue < minDistance);
    let timer = setTimeout(() => {
      if (wrapperRef.current) {
        setCurrentPos(getLeftRef(wrapperRef));
        changeCurrentSlide();
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [translateValue, compWidth, carouselWidth]);

  const changeCurrentSlide = () => {
    const _around = Math.abs(translateValue) / carouselWidth;
    const _currentSlide = Math.floor(_around) + 1;
    setCurrentSlide(_currentSlide);
    const visibles_marks = 5;
    let factor = _currentSlide - visibles_marks;
    factor = factor < 0 ? 0 : factor;
    const circlesMarks = Array.from(
      circlesMarksRef.current.querySelectorAll(`.${styles.CircleMark}`)
    );
    const translate = factor * -16;
    circlesMarks.map((mark, i) => {
      mark.style.transform = `translateX(${translate}px)`;
    });
  };

  const onClickPrevNav = () => {
    swipe(carouselWidth * (currentSlide - 2) * -1);
    setSwipeDirection('left');
  };

  const onClickNextNav = () => {
    swipe(carouselWidth * currentSlide * -1);
    setSwipeDirection('right');
  };

  const swipeComplete = () => {
    const movement = (translateValue / carouselWidth) % 1;
    const _around = Math.abs(translateValue) / carouselWidth;
    const _currentSlide = Math.floor(_around) + 1;
    if (swipeDirection === 'left') {
      if (Math.abs(movement) > 0.1) {
        swipe(carouselWidth * _currentSlide * -1);
      } else {
        swipe(carouselWidth * (_currentSlide - 1));
      }
    } else {
      if (Math.abs(movement) > 0.9) {
        swipe(carouselWidth * _currentSlide * -1);
      } else {
        swipe(carouselWidth * (_currentSlide - 1) * -1);
      }
    }
  };

  const swipe = (_translateValue) => {
    if (_translateValue < maxDistance) {
      _translateValue = maxDistance;
    }
    if (_translateValue > minDistance) {
      _translateValue = minDistance;
    }
    wrapperRef.current.style.transform = `translateX(${_translateValue}px)`;
    setTranslateValue(_translateValue);
  };
  return (
    <div
      className={`${styles.Carousel} ${styles[theme]}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={carouselRef}
    >
      <div ref={wrapperRef} className={styles.CarouselWrapper}>
        {data.map((media, i) => (
          <div className={styles.ImageCnt} key={i}>
            <ImageComp
              src={media.url}
              width={media.width}
              height={media.height}
              alt={media.alt}
            />
          </div>
        ))}
      </div>
      {showPreNav && (
        <div className={styles.PrevNav} onClick={onClickPrevNav}>
          <PrevFilledIcon fill={theme === 'dark' ? '#fff' : '#000'} size={24} />
        </div>
      )}
      {showNextNav && (
        <div className={styles.NextNav} onClick={onClickNextNav}>
          <NextFilledIcon fill={theme === 'dark' ? '#fff' : '#000'} size={24} />
        </div>
      )}
      <div ref={circlesMarksRef} className={styles.CirclesMarks}>
        {data.map((media, i) => (
          <div
            className={`${styles.CircleMark} ${
              currentSlide === i + 1 ? styles.active : ''
            }`}
            key={i}
          ></div>
        ))}
      </div>
    </div>
  );
}
