import React from 'react';
import styles from './SharePost.module.css';
import { ShareIcon, WhatsappIcon } from '@virtel/icons';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import Link from 'next/link';

export default function SharePost({ theme, url }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="link" style={{ height: 'auto' }}>
          <ShareIcon fill={theme === 'dark' ? '#fff' : '#000'} size={24} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Share Options">
        <DropdownItem
          key="facebook"
          startContent={<WhatsappIcon fill={'#000'} size={12} />}
          onClick={() => {
            window.open(`http://www.facebook.com/sharer/sharer.php?u=${url}`);
          }}
        >
          Facebook
        </DropdownItem>
        <DropdownItem
          key="linkedin"
          startContent={<WhatsappIcon fill={'#000'} size={12} />}
          onClick={() => {
            window.open(
              `http://www.linkedin.com/shareArticle?mini=true&url=${url}`
            );
          }}
        >
          Linkedin
        </DropdownItem>
        <DropdownItem
          key="X"
          startContent={<WhatsappIcon fill={'#000'} size={12} />}
          onClick={() => {
            window.open(
              `https://x.com/share?text=Im%20Sharing%20on%20Twitter&url=${url}`
            );
          }}
        >
          X
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
