import '@/styles/grid.css';
import '@/styles/globals.css';

import { AppProvider } from '@/context/AppContext';
import { Roboto } from 'next/font/google';
import { Unlock } from 'next/font/google';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NextUIProvider } from '@nextui-org/react';

const primary_font = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const secondary_font = Unlock({
  subsets: ['latin'],
  weight: ['400'],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth adminOnly={Component.auth.adminOnly}>
          <AppProvider>
            <NextUIProvider>
              <style jsx global>{`
                :root {
                  --primary-color: #38ac9f;
                  --secondary-color: #00a9f2;
                  --black-color: #353434;
                  --white-color: #e6e4e4;
                  --primary-font: ${primary_font.style.fontFamily};
                  --secondary-font: ${secondary_font.style.fontFamily};
                }
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
              `}</style>
              <Component {...pageProps} />
            </NextUIProvider>
          </AppProvider>
        </Auth>
      ) : (
        <AppProvider>
          <NextUIProvider>
            <style jsx global>{`
              :root {
                --primary-color: #38ac9f;
                --secondary-color: #00a9f2;
                --black-color: #353434;
                --white-color: #e6e4e4;
                --primary-font: ${primary_font.style.fontFamily};
                --secondary-font: ${secondary_font.style.fontFamily};
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
            `}</style>
            <Component {...pageProps} />
          </NextUIProvider>
        </AppProvider>
      )}
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (adminOnly && session.user.role !== 'admin') {
    router.push('/login?message=Access Denied');
  }

  return children;
}
