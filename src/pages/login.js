import React from 'react';
import LoginComponent from '@/components/LoginComponent/LoginComponent';
import style from '@/styles/LoginScreen.module.css';
import Image from 'next/image';
import Metaheader from '@/components/Metaheader/Metaheader';

export default function LoginScreen() {
  return (
    <>
      <Metaheader />
      <div className={`${style.LoginScreen}`}>
        <div className={`${style.bg}`}>
          <Image
            src="/assets/images/bg-login.jpg?v=0.1"
            width={952}
            height={627}
            alt=""
          />
        </div>
        <LoginComponent
          options={{
            logo: {
              src: '/assets/images/logo-dark.png',
              width: 116,
              height: 59,
              alt: 'Logo',
            },
          }}
        />
      </div>
    </>
  );
}
