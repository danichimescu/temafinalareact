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
          src="../../assets/logoSovis.png"
          alt="Sovis Print logo"
          height="60"
        />
      </Link>

      <menu className={styles.mainMenu}>
        <li>
          <BrandNavLink to="/">Home</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/boardgames">Boardgames</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/boardgames">Boardgames</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/boardgames">Boardgames</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/comanda">Comanda</BrandNavLink>
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
