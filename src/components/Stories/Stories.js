import React, { useEffect, useRef, useState } from 'react';
import styles from './Stories.module.css';
import Link from 'next/link';
import ImageComp from '@/components/ImageComp/ImageComp';
import { NextFilledIcon, PrevFilledIcon } from '@virtel/icons';

export default function Stories({
  data,
  theme,
  mobileBreakpoint = 599,
  edgeOffset = 0,
}) {
  const storiesRef = useRef();
  const [currentPos, setCurrentPos] = useState();
  const [clientX, setClientX] = useState();
  const [compWidth, setCompWidth] = useState();
  const [screenWidth, setScreenWidth] = useState();
  const [translateValue, setTranslateValue] = useState(0);
  const [showPreNav, setShowPreNav] = useState(false);
  const [showNextNav, setShowNextNav] = useState(false);
  const [startingSwipe, setStartingSwipe] = useState(false);
  const [maxDistance, setMaxDistance] = useState(0);
  const [minDistance, setMinDistance] = useState(0);

  useEffect(() => {
    if (!window) return;
    if (!storiesRef.current) return;
    const boundingStories = storiesRef.current.getBoundingClientRect();
    setMaxDistance(
      (boundingStories.width - (window.screen.width - edgeOffset)) * -1
    );
    setMinDistance(0);
    setCompWidth(boundingStories.width);
    setScreenWidth(window.screen.width);
  }, []);

  const onTouchStart = (e) => {
    if (screenWidth > mobileBreakpoint) return;
    if (compWidth <= screenWidth) return;
    setClientX(e.touches[0].clientX);
    setStartingSwipe(true);
  };

  const onTouchMove = (e) => {
    if (!startingSwipe) return;
    const position = e.nativeEvent.touches[0].clientX;
    const distance = position - clientX;
    swipe(currentPos + distance);
  };

  const onTouchEnd = (e) => {
    setStartingSwipe(false);
  };

  useEffect(() => {
    setShowNextNav(translateValue > maxDistance && compWidth > screenWidth);
    setShowPreNav(translateValue < minDistance);
    let timer = setTimeout(() => {
      if (storiesRef.current) {
        const boundingStories = storiesRef.current.getBoundingClientRect();
        setCurrentPos(boundingStories.left);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [translateValue, compWidth, screenWidth]);

  const onClickPrevNav = () => {
    swipe(currentPos + screenWidth);
  };

  const onClickNextNav = () => {
    swipe(currentPos - screenWidth);
  };

  const swipe = (_translateValue) => {
    if (_translateValue < maxDistance) {
      _translateValue = maxDistance;
    }
    if (_translateValue > minDistance) {
      _translateValue = minDistance;
    }
    storiesRef.current.style.transform = `translate(${_translateValue}px,0)`;
    setTranslateValue(_translateValue);
  };
  return (
    <div
      className={`${styles.StoriesContainer} ${styles[theme]}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={storiesRef} className={styles.Stories}>
        {data.map((story, i) => (
          <Link href={story.link.url} className={styles.Story} key={i}>
            <div className={styles.Border}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src={story.media.url}
                  width={story.media.width}
                  height={story.media.height}
                  alt={story.media.alt}
                />
              </div>
            </div>
            <div className={`${styles.StoryName} hide-xs hide-sm hide-md`}>
              {story.name.text}
            </div>
            <div className={`${styles.StoryLink} hide-xs hide-sm hide-md`}>
              {story.link.label}
            </div>
          </Link>
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
    </div>
  );
}
