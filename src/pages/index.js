import ImageComp from '@/components/ImageComp/ImageComp';
import Layout from '@/components/Layout/Layout';
import Metaheader from '@/components/Metaheader/Metaheader';
import Stories from '@/components/Stories/Stories';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import Whatsapp from '@/components/Whatsapp/Whatsapp';
import { getPosts } from '@/ssg/posts/list';

export default function Home({ staticdata }) {
  const stories = staticdata || [];
  const { data: session } = useSession();
  const { state, dispatch } = useContext(AppContext);
  return (
    <>
      <Metaheader />
      <Layout session={session}>
        <div className={`${styles.Home} ${styles[state.theme]}`}>
          <div className={styles.BG}>
            <ImageComp
              src="/assets/images/bg-home-lg-06.png?v=0.6"
              width={840}
              height={1264}
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
                  Un Caballo con dientes sanos vive más y en definitiva aumenta
                  su vida útil
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
                <Whatsapp theme={state.theme} />
              </div>
            </div>
            <div className={styles.CopyRight}>
              <p>
                &copy; Equioral Todos los Derechos Reservados{' '}
                {new Date().getFullYear()}. Powered By Virtel
              </p>
            </div>
            <div className={styles.StoriesCnt}>
              <Stories
                theme={state.theme}
                edgeOffset={40}
                mobileBreakpoint={767}
                data={stories}
                showName={true}
                showLinkLabel={false}
                storyFlex="column"
              />
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
