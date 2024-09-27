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
import storiesData from '@/data/defaultStories.json';
import Stories from '@/components/Stories/Stories';
import Metaheader from '@/components/Metaheader/Metaheader';
import Layout from '@/components/Layout/Layout';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Post from '@/components/Post/Post';
import Whatsapp from '@/components/Whatsapp/Whatsapp';
import { getPosts } from '@/ssg/posts/list';

async function deletePost(uid) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/posts/delete?uid=${uid}`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default function ServiciosCasos({ staticdata }) {
  const stories = staticdata || [];
  const { data: session } = useSession();
  const { state, dispatch } = useContext(AppContext);
  const [screenWidth, setScreenWidth] = useState();
  const [postsData, setPostsData] = useState(staticdata || []);
  const [postToEdit, setPostToEdit] = useState();
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
    //fetchPosts();
  }, []);

  const onDeletePost = async (post) => {
    const resp = await deletePost(post._uid);
    if (resp.ok) {
      toast.success(
        'Se Removio el Post, por favor Refresque la página para ver los cambios'
      );
      location.reload();
    } else {
      toast.error('Ocurrio un error');
    }
  };

  const onCloseAddPost = () => {
    setPostToEdit(null);
  };

  return (
    <>
      <Metaheader />
      <Layout
        navbarClass={`hide-lg hide-xl`}
        session={session}
        postToEdit={postToEdit}
        onCloseAddPost={onCloseAddPost}
      >
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
              <Whatsapp theme={state.theme} />
            </div>
          </div>
          <div className={styles.MainContent}>
            <div className={styles.Container}>
              {postsData &&
                postsData.map((post, i) => (
                  <Post
                    key={i}
                    post={post}
                    theme={state.theme}
                    session={session}
                    onEdit={(post) => setPostToEdit(post)}
                    onDelete={onDeletePost}
                  />
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
                data={stories}
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

export async function getStaticProps() {
  let resp = await getPosts();
  let staticdata = resp && resp.records.length > 0 ? [...resp.records] : [];

  return {
    props: {
      staticdata,
    },
    revalidate: 10,
  };
}
