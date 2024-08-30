import MainNavbar from '@/components/MainNavbar/MainNavbar';
import React, { useContext } from 'react';
import styles from '@/styles/Home.module.css';
import { AppContext } from '@/context/AppContext';
import ImageComp from '@/components/ImageComp/ImageComp';
import Link from 'next/link';
import { WhatsappIcon } from '@virtel/icons';

export default function Home() {
  const { state, dispatch } = useContext(AppContext);
  return (
    <>
      <MainNavbar />
      <div className={`${styles.Home} ${styles[state.theme]}`}>
        <div className={styles.BG}>
          <ImageComp
            src="/assets/images/bg-home-lg-02-c.png?v=0.4"
            width={683}
            height={707}
            alt=""
            priority
          />
        </div>
        <div className={styles.Container}>
          <div className={styles.Info}>
            <div className={styles.InfoText}>
              <div className={styles.titles}>
                <h1>Diego Posso Castaño</h1>
                <h2>Odontólogo Equino</h2>
              </div>
              <p>
                Un Caballo con dientes sanos vive más y en definitiva aumenta su
                vida útil
              </p>
            </div>
            <div className={styles.InfoLinks}>
              <div className={styles.DirectLinks}>
                <Link href="/servicios-y-casos">
                  <ImageComp
                    src="/assets/images/thumbnail-01.png?v=1.0"
                    width={81}
                    height={62}
                    alt="Servicios y Casos"
                  />
                </Link>
                <Link href="/quienes-somos">
                  <ImageComp
                    src="/assets/images/thumbnail-02.png?v=1.0"
                    width={81}
                    height={62}
                    alt="Quiénes Somos"
                  />
                </Link>
                <Link href="/contactanos">
                  <ImageComp
                    src="/assets/images/thumbnail-03.png?v=1.0"
                    width={81}
                    height={62}
                    alt="Contáctanos"
                  />
                </Link>
              </div>
              <div className={styles.Whatsapp}>
                <Link href="https://web.whatsapp.com/send?phone=573105033808&text=">
                  <div className={styles.Icon}>
                    <WhatsappIcon
                      size={12}
                      fill={state.theme === 'dark' ? '#fff' : '#000'}
                    />
                  </div>
                  <span>Contáctame por Whatsapp</span>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.CopyRight}>
            <p>
              &copy; Equioral Todos los Derechos Reservados{' '}
              {new Date().getFullYear()}. Powered By Virtel
            </p>
          </div>
          <div className={styles.Stories}>
            <Link href="#" className={styles.Story}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src="/assets/images/stories/story-01.png"
                  width={73}
                  height={73}
                  alt=""
                />
              </div>
            </Link>
            <Link href="#" className={styles.Story}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src="/assets/images/stories/story-02.png"
                  width={73}
                  height={73}
                  alt=""
                />
              </div>
            </Link>
            <Link href="#" className={styles.Story}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src="/assets/images/stories/story-03.png"
                  width={73}
                  height={73}
                  alt=""
                />
              </div>
            </Link>
            <Link href="#" className={styles.Story}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src="/assets/images/stories/story-04.png"
                  width={73}
                  height={73}
                  alt=""
                />
              </div>
            </Link>
            <Link href="#" className={styles.Story}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src="/assets/images/stories/story-05.png"
                  width={73}
                  height={73}
                  alt=""
                />
              </div>
            </Link>
            <Link href="#" className={styles.Story}>
              <div className={styles.ImgCnt}>
                <ImageComp
                  src="/assets/images/stories/story-06.png"
                  width={73}
                  height={73}
                  alt=""
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
