import MainNavbar from '@/components/MainNavbar/MainNavbar';
import React, { useContext } from 'react';
import styles from '@/styles/QuienesSomos.module.css';
import { AppContext } from '@/context/AppContext';
import ImageComp from '@/components/ImageComp/ImageComp';
import Link from 'next/link';
import { WhatsappIcon } from '@virtel/icons';

export default function Contactanos() {
  const { state, dispatch } = useContext(AppContext);
  return (
    <>
      <MainNavbar />
      <h1>Under Construction...</h1>
    </>
  );
}
