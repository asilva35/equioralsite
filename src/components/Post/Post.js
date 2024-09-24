import React, { useEffect, useState } from 'react';
import styles from './Post.module.css';
import ImageComp from '../ImageComp/ImageComp';
import Carousel from '../Carousel/Carousel';
import { HeartIcon, MenuIcon, ShareIcon, WhatsappIcon } from '@virtel/icons';
import { formatDate } from '@/utils/utils';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import Whatsapp from '../Whatsapp/Whatsapp';
import SharePost from '../SharePost/SharePost';
import Link from 'next/link';

const addLike = async (_uid) => {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/addlike/?_uid=${_uid}`;
  await fetch(url);
};

export default function Post({ theme, post, session, onEdit, onDelete }) {
  const [extendDescription, setExtendDescription] = useState(false);
  const [liked, setLiked] = useState(false);

  const getFormatedDate = (date_str) => {
    return formatDate(date_str);
  };
  const formatDescription = (description) => {
    if (!description) return '';
    if (!extendDescription) {
      return description.length > 150
        ? `${description.substr(0, 150)}...`
        : description;
    } else {
      return description;
    }
  };

  const onAddLike = () => {
    if (liked) return;
    addLike(post._uid);
    setLiked(true);
  };

  return (
    <div className={styles.Post}>
      <div className={styles.HeaderPost}>
        <div className={styles.LogoContainer}>
          <div className={styles.LogoSmall}>
            {theme === 'dark' ? (
              <ImageComp
                src="/assets/images/logo-light-small.png"
                width={41}
                height={42}
                alt=""
              />
            ) : (
              <ImageComp
                src="/assets/images/logo-dark-small.png"
                width={41}
                height={42}
                alt=""
              />
            )}
          </div>
          <span>Equioral</span>
        </div>
        <div className={styles.Menu}>
          {session?.user && (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="link" isIconOnly>
                  <MenuIcon
                    fill={theme === 'dark' ? '#fff' : '#000'}
                    size={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Post Actions">
                <DropdownItem key="edit" onClick={() => onEdit(post)}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => onDelete(post)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
      <Carousel theme={theme} data={post.Photos} />
      <div className={styles.ActionsPost}>
        <div className={styles.Left}>
          <div className={styles.Action} onClick={onAddLike}>
            <HeartIcon
              fill={liked ? '#f00' : theme === 'dark' ? '#fff' : '#000'}
              size={24}
            />
          </div>
          <div className={styles.Action}>
            {/* <ShareIcon fill={theme === 'dark' ? '#fff' : '#000'} size={24} /> */}
            <SharePost
              theme={theme}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/${post.Url}`}
            />
          </div>
        </div>
        <div className={styles.Right}>
          <div className={styles.Action}>
            <Whatsapp
              theme={theme}
              showLabel={false}
              icon={{ style: 'basic', size: 24 }}
            />
          </div>
        </div>
      </div>
      <div className={styles.InfoPost}>
        <div className={styles.Title}>
          <div className={styles.Name}>
            <Link href={post.Url}>{post.Title}</Link>
          </div>
          <div className={styles.Date}>{getFormatedDate(post.Date)}</div>
        </div>
        <div
          className={styles.Description}
          onClick={() => setExtendDescription(!extendDescription)}
        >
          {formatDescription(post.Description)}
        </div>
      </div>
    </div>
  );
}
