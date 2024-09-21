import styles from '@/styles/ServiciosCasos.module.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import ImageComp from '@/components/ImageComp/ImageComp';
import Link from 'next/link';
import {
  HeartIcon,
  ShareIcon,
  ThemeDarkIcon,
  ThemeLightIcon,
  WhatsappIcon,
} from '@virtel/icons';
import defaultPosts from '@/data/defaultPosts.json';
import storiesData from '@/data/defaultStories.json';
import Stories from '@/components/Stories/Stories';
import Carousel from '@/components/Carousel/Carousel';
import Metaheader from '@/components/Metaheader/Metaheader';
import Layout from '@/components/Layout/Layout';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/utils/utils';
import Post from '@/components/Post/Post';

async function getPosts(page = 1, pageSize = 20, search = '') {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/list?page=${page}&pageSize=${pageSize}&search=${search}`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default function ServiciosCasos() {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(AppContext);
  const [screenWidth, setScreenWidth] = useState();
  const [postsData, setPostsData] = useState();
  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      theme: state.theme === 'dark' ? 'light' : 'dark',
    });
  };

  useEffect(() => {
    if (!window) return;
    const handleResize = () => {
      setScreenWidth(window.screen.width);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    const resp = await getPosts();
    if (resp.ok) {
      const resp_json = await resp.json();
      setPostsData(resp_json.data.records);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getFormatedDate = (date_str) => {
    return formatDate(date_str);
  };

  return (
    <>
      <Metaheader />
      <Layout navbarClass={`hide-lg hide-xl`} session={session}>
        <div className={`${styles.Page} ${styles[state.theme]}`}>
          <div className={`${styles.SidebarLeft} hide-xs hide-sm hide-md`}>
            <div className={styles.Top}>
              <div className={styles.LogoContainer}>
                <Link href="/">
                  {state.theme === 'dark' ? (
                    <ImageComp
                      src="/assets/images/logo-light.png"
                      width={116}
                      height={59}
                      alt="Logo"
                    />
                  ) : (
                    <ImageComp
                      src="/assets/images/logo-dark.png"
                      width={116}
                      height={59}
                      alt="Logo"
                    />
                  )}
                </Link>
              </div>
              <div className={styles.Nav}>
                <Link href="/">Inicio</Link>
                <Link href="/quienes-somos">Acerca</Link>
                <Link href="/servicios-y-casos">Servicios & Casos</Link>
                <Link href="/contactanos">Contacto</Link>
                <Link href={session?.user ? '/close-session' : '/login'}>
                  {session?.user ? 'Logout' : 'Login'}
                </Link>
              </div>
            </div>
            <div className={styles.Bottom}>
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
          <div className={styles.MainContent}>
            <div className={styles.Container}>
              {postsData &&
                postsData.map((post, i) => (
                  <Post key={i} post={post} theme={state.theme} />
                  // <div className={styles.Post} key={i}>
                  //   <div className={styles.HeaderPost}>
                  //     <div className={styles.LogoSmall}>
                  //       {state.theme === 'dark' ? (
                  //         <ImageComp
                  //           src="/assets/images/logo-light-small.png"
                  //           width={41}
                  //           height={42}
                  //           alt=""
                  //         />
                  //       ) : (
                  //         <ImageComp
                  //           src="/assets/images/logo-dark-small.png"
                  //           width={41}
                  //           height={42}
                  //           alt=""
                  //         />
                  //       )}
                  //     </div>
                  //     <span>Equioral</span>
                  //   </div>
                  //   <Carousel
                  //     theme={state.theme}
                  //     data={defaultPosts[0].media}
                  //   />
                  //   <div className={styles.ActionsPost}>
                  //     <div className={styles.Left}>
                  //       <div className={styles.Action}>
                  //         <HeartIcon
                  //           fill={state.theme === 'dark' ? '#fff' : '#000'}
                  //           size={24}
                  //         />
                  //       </div>
                  //       <div className={styles.Action}>
                  //         <ShareIcon
                  //           fill={state.theme === 'dark' ? '#fff' : '#000'}
                  //           size={24}
                  //         />
                  //       </div>
                  //     </div>
                  //     <div className={styles.Right}>
                  //       <div className={styles.Action}>
                  //         <WhatsappIcon
                  //           fill={state.theme === 'dark' ? '#fff' : '#000'}
                  //           size={24}
                  //         />
                  //       </div>
                  //     </div>
                  //   </div>
                  //   <div className={styles.InfoPost}>
                  //     <div className={styles.Title}>
                  //       <div className={styles.Name}>{post.Title}</div>
                  //       <div className={styles.Date}>
                  //         {getFormatedDate(post.Date)}
                  //       </div>
                  //     </div>
                  //     <div className={styles.Description}>
                  //       {post.Description}
                  //     </div>
                  //   </div>
                  // </div>
                ))}
              {!postsData && (
                <div className={styles.Post}>
                  <div className={styles.HeaderPost}>
                    <div className={`${styles.LogoSmall} skeleton`}></div>
                    <span
                      className={`${styles.LogoSmallLabel} skeleton`}
                    ></span>
                  </div>
                  <div className={`${styles.CarouselBlank} skeleton`} />
                  <div className={`${styles.InfoPost} skeleton`}></div>
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.SidebarRight}`}>
            <div
              className={`${styles.SidebarRightHeader} hide-xs hide-sm hide-md`}
            >
              <span>Casos Destacados</span>
              <div className={`${styles.BtnTheme}`} onClick={toggleTheme}>
                {state.theme === 'dark' ? (
                  <ThemeLightIcon size={24} fill={'#fff'} />
                ) : (
                  <ThemeDarkIcon size={24} fill={'#000'} />
                )}
              </div>
            </div>
            <div className={`${styles.SidebarRightBody}`}>
              <Stories
                theme={state.theme}
                edgeOffset={40}
                mobileBreakpoint={599}
                data={storiesData}
                showName={true}
                showLinkLabel={screenWidth > 991 ? true : false}
                storyFlex={screenWidth > 991 ? 'row' : 'column'}
              />
            </div>
            <div className={`${styles.CopyRight} hide-xs hide-sm hide-md`}>
              <p>
                &copy; Equioral Todos los Derechos Reservados{' '}
                {new Date().getFullYear()}. Powered By Virtel
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
