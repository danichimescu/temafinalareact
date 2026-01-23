import { Link } from 'react-router';
import { BrandNavLink } from './BrandNavLink';
import { useAuthContext } from '../../features/Auth/AuthContext';
import { HashLink } from 'react-router-hash-link';

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
          { //<BrandNavLink to="/">Home</BrandNavLink>
          }
          <HashLink to="/#home" smooth className={styles.navLink}>
            Home
          </HashLink>
        </li>
        <li>
          <HashLink to="/#services" smooth className={styles.navLink}>
            Services
          </HashLink>
        </li>
        <li>
          <HashLink to="/#portfolio" smooth className={styles.navLink}>
            Portfolio
          </HashLink>
        </li>

        <li>
          <HashLink to="/#contact" smooth className={styles.navLink}>
            Contact
          </HashLink>
        </li>
        <li>
          <HashLink to="/#sendamessage" smooth className={styles.navLink}>
            Send a Message
          </HashLink>
        </li>
        <li>
          <HashLink to="/#about" smooth className={styles.navLink}>
            About
          </HashLink>
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
