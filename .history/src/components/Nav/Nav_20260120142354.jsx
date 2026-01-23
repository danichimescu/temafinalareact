import { Link } from 'react-router';
import { BrandNavLink } from './BrandNavLink';
import { useAuthContext } from '../../features/Auth/AuthContext';

import styles from './Nav.module.css';

export function Nav() {
  const { user, logout } = useAuthContext();

  return (
    <nav className={styles.nav} aria-label="main menu">
      <Link to="/">
        <img
          src="src/assets/logoSovis.png" //"../../assets/logoSovis.png"
          alt="Sovis Print logo"
          height="40"
        />
      </Link>

      <menu className={styles.mainMenu}>
        <li>
          <BrandNavLink to="/">Home</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/#services">Services</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/portfolio">Portofolio</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/about">About</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/contact">Contact</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/comanda">Make an order</BrandNavLink>
        </li>


        {!user && (
          <>
            <li className={styles.pushRight}>
              <BrandNavLink className={styles.special} to="/login">Login</BrandNavLink>
            </li>
            <li>
              <BrandNavLink to="/register">Register</BrandNavLink>
            </li>
          </>
        )}

        {user && (
          <li className={styles.pushRight}>
            Welcome, {user.firstName}!
            <a href="/" onClick={(e) => {
              e.preventDefault();
              logout();
            }}>Logout</a>
          </li>
        )}
      </menu>
    </nav>
  );
}
