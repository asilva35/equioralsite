import React from 'react';
import MainNavbar from '@/components/MainNavbar/MainNavbar';
import AddPost from '@/components/AddPost/AddPost';

export default function Layout({
  navbarClass,
  session,
  children,
  postToEdit,
  onCloseAddPost,
}) {
  return (
    <div>
      <MainNavbar session={session} className={navbarClass} />
      {children}
      {session?.user && (
        <AddPost postToEdit={postToEdit} onCloseAddPost={onCloseAddPost} />
      )}
    </div>
  );
}
