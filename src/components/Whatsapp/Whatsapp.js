import { WhatsappIcon } from '@virtel/icons';
import Link from 'next/link';
import React from 'react';
import styles from './Whatsapp.module.css';

export default function Whatsapp({ theme, showLabel = true, icon = {} }) {
  const iconStyle = icon.style || 'bordered';
  const iconSize = icon.size || 12;
  return (
    <div className={styles.Whatsapp}>
      <Link href="https://web.whatsapp.com/send?phone=573105033808&text=">
        <div className={`${styles.Icon} ${styles[theme]} ${styles[iconStyle]}`}>
          <WhatsappIcon
            size={iconSize}
            fill={theme === 'dark' ? '#fff' : '#000'}
          />
        </div>
        {showLabel && <span>Contáctame por Whatsapp</span>}
      </Link>
    </div>
  );
}
