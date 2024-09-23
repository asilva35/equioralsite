import ImageComp from '@/components/ImageComp/ImageComp';
import Layout from '@/components/Layout/Layout';
import Metaheader from '@/components/Metaheader/Metaheader';
import Post from '@/components/Post/Post';
import Stories from '@/components/Stories/Stories';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/ServiciosCasos.module.css';
import { Button } from '@nextui-org/react';
import { ThemeDarkIcon, ThemeLightIcon, WhatsappIcon } from '@virtel/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

async function getPosts(page = 1, pageSize = 20, search = '') {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/list?page=${page}&pageSize=${pageSize}&search=${search}`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getPost(slug) {
  const post_url = `/servicios-y-casos/${slug}`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/get?url=${post_url}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (resp.ok) {
    return await resp.json();
  }

  return [];
}

async function deletePost(uid) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/posts/delete?uid=${uid}`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getDocHeight() {
  var D = document;
  return Math.max(
    D.body.scrollHeight,
    D.documentElement.scrollHeight,
    D.body.offsetHeight,
    D.documentElement.offsetHeight,
    D.body.clientHeight,
    D.documentElement.clientHeight
  );
}

function ScreenCaso({ slug, staticdata }) {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(AppContext);
  const [screenWidth, setScreenWidth] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [extraPosts, setExtraPosts] = useState([]);
  const [loadingExtraPosts, setLoadingExtraPosts] = useState(false);
  const [postToEdit, setPostToEdit] = useState();
  const [currentPost, setCurrentPost] = useState(slug);
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
    if (loadingExtraPosts) return;
    setLoadingExtraPosts(true);
    const loadedRecords = extraPosts;
    const resp = await getPosts(currentPage + 1);
    if (resp.ok) {
      const resp_json = await resp.json();
      const _extraPosts = resp_json.data;
      const new_records = _extraPosts.records || [];
      setExtraPosts(loadedRecords.concat(new_records));
      setCurrentPage(currentPage + 1);
      setTotalPages(_extraPosts.totalPages);
      setLoadingExtraPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!document) return;
    const onScrollBottom = (evt) => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        if (loadingExtraPosts) return;
        fetchPosts();
      }
    };
    window.addEventListener('scroll', onScrollBottom);
    return () => {
      window.removeEventListener('scroll', onScrollBottom);
    };
  }, [currentPage, loadingExtraPosts]);
  const onDeletePost = async (post) => {
    const resp = await deletePost(post._uid);
    if (resp.ok) {
      toast.success(
        'Se Removio el Post, por favor Refresque la página para ver los cambios'
      );
    } else {
      toast.error('Ocurrio un error');
    }
  };
  const onCloseAddPost = () => {
    setPostToEdit(null);
  };
  useEffect(() => {}, [extraPosts]);

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
              <Post
                post={currentPost}
                theme={state.theme}
                session={session}
                onEdit={(post) => setPostToEdit(post)}
                onDelete={onDeletePost}
              />

              {extraPosts.length > 0 &&
                extraPosts.map(
                  (post, i) =>
                    post._uid !== currentPost._uid && (
                      <Post
                        post={post}
                        theme={state.theme}
                        session={session}
                        onEdit={(post) => setPostToEdit(post)}
                        onDelete={onDeletePost}
                        key={i}
                      />
                    )
                )}
              {extraPosts.length > 0 && currentPage < totalPages && (
                <Button
                  className={styles.BtnLoadMore}
                  onClick={fetchPosts}
                  isLoading={loadingExtraPosts}
                >
                  Cargar Más Casos
                </Button>
              )}
              {extraPosts.length == 0 && (
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
                data={staticdata}
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

export async function getStaticPaths() {
  const resp = await getPosts(1, 20);
  if (!resp.ok)
    return {
      paths: [{ slug: '' }],
      fallback: 'blocking',
    };

  const resp_json = await resp.json();

  const posts = resp_json.data;
  let totalPages = 0;
  let paths = [];

  if (!posts || !posts.records || posts.records.length === 0)
    return {
      paths: [{ slug: '' }],
      fallback: 'blocking',
    };

  posts.records.map((post, i) => {
    paths.push({
      params: {
        slug: post.Url,
      },
    });
  });

  totalPages = Number(posts.totalPages);

  for (let i = 1; i < totalPages; i++) {
    let posts = await getPosts(i);

    if (posts && posts.records && posts.records.length > 0) {
      posts.records.map((post, i) => {
        paths.push({
          params: {
            url: post.Url,
          },
        });
      });
    }
  }
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(data) {
  let resp = await getPost(data.params.slug);
  let slug = {};
  if (resp && resp.data && resp.data.records.length > 0) {
    slug = { ...resp.data.records[0] };
  }

  let respPosts = await getPosts();
  let staticdata = [];
  if (respPosts.ok) {
    const resp_json = await respPosts.json();
    if (resp_json && resp_json.data && resp_json.data.records.length > 0) {
      staticdata = [...resp_json.data.records];
    }
  }

  return {
    props: {
      slug,
      staticdata,
    },
    revalidate: 10,
  };
}

export default ScreenCaso;
