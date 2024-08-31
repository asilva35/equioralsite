import React, { useEffect, useRef, useState } from 'react';
import styles from './Stories.module.css';
import Link from 'next/link';
import ImageComp from '@/components/ImageComp/ImageComp';
import { NextFilledIcon, PrevFilledIcon } from '@virtel/icons';

export default function Stories({ theme }) {
  let clientX;
  let clientY;
  let deltaX;
  let deltaY;

  const storiesRef = useRef();
  const [showPreNav, setShowPreNav] = useState(false);
  const [showNextNav, setShowNextNav] = useState(false);
  const [countTranslate, setCountTranslate] = useState(0);

  const onTouchStart = (e) => {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    deltaX = e.changedTouches[0].clientX - clientX;
    deltaY = e.changedTouches[0].clientY - clientY;
  };

  const onTouchEnd = (e) => {
    const boundingStories = storiesRef.current.getBoundingClientRect();
    let newpos = boundingStories.left + deltaX;
    if (window.screen.width > 599) return;
    if (boundingStories.width <= window.screen.width) return;
    if (newpos < (boundingStories.width - (window.screen.width - 40)) * -1) {
      newpos = (boundingStories.width - (window.screen.width - 40)) * -1;
    }
    if (newpos > 0) {
      newpos = 0;
    }
    storiesRef.current.style.transform = `translate(${newpos}px,0)`;
    setCountTranslate((c) => c + 1);
  };

  useEffect(() => {
    const boundingStories = storiesRef.current.getBoundingClientRect();
    if (boundingStories.width > window.screen.width) {
      setShowNextNav(true);
    }
    if (boundingStories.left < 0) {
      setShowPreNav(true);
    }
  }, [countTranslate]);

  const onClickPrevNav = () => {
    const boundingStories = storiesRef.current.getBoundingClientRect();
    let newpos = boundingStories.left + 60;
    if (newpos < (boundingStories.width - (window.screen.width - 40)) * -1) {
      newpos = (boundingStories.width - (window.screen.width - 40)) * -1;
    }
    if (newpos > 0) {
      newpos = 0;
    }
    storiesRef.current.style.transform = `translate(${newpos}px,0)`;
    setCountTranslate((c) => c + 1);
  };

  const onClickNextNav = () => {
    const boundingStories = storiesRef.current.getBoundingClientRect();
    let newpos = boundingStories.left - 80;
    if (newpos < (boundingStories.width - (window.screen.width - 40)) * -1) {
      newpos = (boundingStories.width - (window.screen.width - 40)) * -1;
    }
    if (newpos > 0) {
      newpos = 0;
    }
    storiesRef.current.style.transform = `translate(${newpos}px,0)`;
    setCountTranslate((c) => c + 1);
  };
  return (
    <div
      className={`${styles.StoriesContainer} ${styles[theme]}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={storiesRef} className={styles.Stories}>
        <Link href="#" className={styles.Story}>
          <div className={styles.Border}>
            <div className={styles.ImgCnt}>
              <ImageComp
                src="/assets/images/stories/story-01.png"
                width={73}
                height={73}
                alt=""
              />
            </div>
          </div>
          <div className={`${styles.StoryName} hide-xs hide-sm hide-md`}>
            Clientes
          </div>
          <div className={`${styles.StoryLink} hide-xs hide-sm hide-md`}>
            Ver más
          </div>
        </Link>
        <Link href="#" className={styles.Story}>
          <div className={styles.Border}>
            <div className={styles.ImgCnt}>
              <ImageComp
                src="/assets/images/stories/story-02.png"
                width={73}
                height={73}
                alt=""
              />
            </div>
          </div>
          <div className={`${styles.StoryName} hide-xs hide-sm hide-md`}>
            Cronolo...
          </div>
          <div className={`${styles.StoryLink} hide-xs hide-sm hide-md`}>
            Ver más
          </div>
        </Link>
        <Link href="#" className={styles.Story}>
          <div className={styles.Border}>
            <div className={styles.ImgCnt}>
              <ImageComp
                src="/assets/images/stories/story-03.png"
                width={73}
                height={73}
                alt=""
              />
            </div>
          </div>
          <div className={`${styles.StoryName} hide-xs hide-sm hide-md`}>
            Fractura...
          </div>
          <div className={`${styles.StoryLink} hide-xs hide-sm hide-md`}>
            Ver más
          </div>
        </Link>
        <Link href="#" className={styles.Story}>
          <div className={styles.Border}>
            <div className={styles.ImgCnt}>
              <ImageComp
                src="/assets/images/stories/story-04.png"
                width={73}
                height={73}
                alt=""
              />
            </div>
          </div>
          <div className={`${styles.StoryName} hide-xs hide-sm hide-md`}>
            Reducci...
          </div>
          <div className={`${styles.StoryLink} hide-xs hide-sm hide-md`}>
            Ver más
          </div>
        </Link>
        <Link href="#" className={styles.Story}>
          <div className={styles.Border}>
            <div className={styles.ImgCnt}>
              <ImageComp
                src="/assets/images/stories/story-05.png"
                width={73}
                height={73}
                alt=""
              />
            </div>
          </div>
          <div className={`${styles.StoryName} hide-xs hide-sm hide-md`}>
            Incisivos
          </div>
          <div className={`${styles.StoryLink} hide-xs hide-sm hide-md`}>
            Ver más
          </div>
        </Link>
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
