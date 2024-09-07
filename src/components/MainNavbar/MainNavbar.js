import React, { useContext, useEffect } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from '@nextui-org/react';
import ImageComp from '@/components/ImageComp/ImageComp';
import styles from './MainNavbar.module.css';
import { ThemeLightIcon, HamburguerIcon, ThemeDarkIcon } from '@virtel/icons';
import { AppContext } from '@/context/AppContext';

export default function MainNavbar({ className }) {
  const [linkActive, seLinkActive] = React.useState('/');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    if (!document) return;
    seLinkActive(document.location.pathname);
  }, []);

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      theme: state.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const menuItems = [
    { label: 'Inicio', href: '/', className: '' },
    { label: 'Acerca', href: '/quienes-somos', className: '' },
    { label: 'Servicios y Casos', href: '/servicios-y-casos', className: '' },
    {
      label: 'Contáctanos',
      href: '/contactanos',
      className: 'hide-lg hide-xl',
    },
  ];
  return (
    <Navbar
      className={`${styles.MainNavbar} ${styles[state.theme]} ${className}`}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className={styles.LogoCnt}>
        <NavbarBrand>
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
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className={`${styles.LgLinks} hide-xs hide-sm hide-md`}
        justify="end"
      >
        {menuItems.map((item, index) => (
          <NavbarItem key={`nav-${item}-${index}`} className={item.className}>
            <Link
              className={item.href === linkActive ? styles.active : ''}
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className={styles.Right}>
        <NavbarItem className="hide-xs hide-sm">
          <Button as={Link} href="#" className={styles.ContactBtn}>
            Contacto
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            className={styles.ThemeBtn}
            isIconOnly
            variant="flat"
            onClick={toggleTheme}
          >
            {state.theme === 'dark' ? (
              <ThemeLightIcon size={24} fill={'#fff'} />
            ) : (
              <ThemeDarkIcon size={24} fill={'#000'} />
            )}
          </Button>
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="hide-lg hide-xl"
          icon={
            <HamburguerIcon
              size={24}
              fill={state.theme === 'dark' ? '#fff' : '#000'}
            />
          }
        />
      </NavbarContent>

      <NavbarMenu className={`${styles.MobileMenu} ${styles[state.theme]}`}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`} className={item.className}>
            <Link href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
