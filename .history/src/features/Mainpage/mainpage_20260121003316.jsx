import { useEffect, useMemo, useState } from 'react';
import styles from './mainpage.module.css';

// export function Mainpage() {
// return (
//     <>
//       <h1>Home</h1>
      
//     </>)
// }

export function Mainpage() {

  const [serviceType, setServiceType] = useState('');
  const [printFormat, setPrintFormat] = useState('A5');
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState('single');
  const [colorType, setColorType] = useState('color');
  const [priceResult, setPriceResult] = useState('');
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const updateOrderForm = (value) => {
    setServiceType(value);
  };

  const calculatePrice = () => {
    // Add your price calculation logic here
    setPriceResult('Price calculated!');
    setShowSubmitBtn(true);
  };

  const sendEstimatedData = () => {
    // Add your send logic here
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <>


      <section id="home"  className={styles.home_class}>
        {/* video back */}
        <div className={styles['video-container-back']}>
          <video id="myVideo" autoPlay muted loop>
            <source src="src/assets/1008811463-preview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={styles['video-overlay']}></div>
        </div>
        {/* text home */}
        <div className={styles.home_content}>
          <h1>Welcome to the house of printing!</h1>
          <p>We printing all kind of material and personalised a lot of objects for your advertising</p>
        </div>
      </section>

      <section id="services" className={styles['services-section']} ba>
       
        <div className={styles.services_content}>
          <h2>Our Services</h2>
          {/* insert services grid */}
          <div className={styles['services-grid']}>
            <div className={styles.service}>
              <h3>Prepress</h3>
              <p>We prepare your files for printing, ensuring colors, bleed, and alignment are perfect.</p>
            </div>
            <div className={styles.service}>
              <h3>Offset Printing</h3>
              <p>High-quality offset printing for catalogs, brochures, and marketing materials.</p>
            </div>
            <div className={styles.service}>
              <h3>Digital Printing</h3>
              <p>Fast turnaround digital printing for small to medium runs with vivid color accuracy.</p>
            </div>
            <div className={styles.service}>
              <h3>Design</h3>
              <p>Professional graphic design to bring your brand and ideas to life with visual impact.</p>
            </div>
            <div className={styles.service}>
              <h3>Finishing</h3>
              <p>We handle binding, lamination, cutting, and folding for a polished final product.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className={styles['portfolio-section']}>
        <div className={styles.portfolio_content}>
          <div className={styles['gallery-container']}>
            <div className={styles['gallery-header']}>
              <h1>Portfolio</h1>
              <div className={styles['image-counter']} id="imageCounter">Loading...</div>
            </div>
            <div className={styles['image-display']} id="imageDisplay">
              <div className={styles['loading-message']}>Loading images...</div>
            </div>
            <div className={styles.controls}>
              <button className={styles['nav-button']} id="prevBtn" disabled>← Previous</button>
              <button className={styles['nav-button']} id="nextBtn" disabled>Next →</button>
            </div>
            <div className={styles['thumbnail-strip']} id="thumbnailStrip"></div>
            <div className={styles.shortcuts}>
              Use ← → arrow keys to navigate | Click thumbnails to jump to image
            </div>
          </div>
        </div>
      </section>

      <section id="order" className={styles['order-section']}>
        <div className={styles.content}>
          <h2>Make an Order</h2>
          <div className={styles['order-form']}>
            <div className={styles['form-group']}>
              <label>Service Type:</label>
              <select id="serviceType" value={serviceType} onChange={(e) => updateOrderForm(e.target.value)}>
                <option value="">Select Service</option>
                <option value="printing">Printing</option>
                <option value="3d-letters">3D Letters</option>
                <option value="stickers">Stickers</option>
                <option value="billboards">Billboard Materials</option>
                <option value="promotional">Promotional Items</option>
              </select>
            </div>
            {/* Printing Options */}
            <div id="printingOptions" className={serviceType !== 'printing' ? styles.hidden : ''}>
              <div className={styles['form-group']}>
                <label>Format:</label>
                <select id="printFormat" value={printFormat} onChange={(e) => setPrintFormat(e.target.value)}>
                  <option value="A5">A5</option>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="SRA3">SRA3</option>
                  <option value="A2">A2</option>
                  <option value="A1">A1</option>
                  <option value="A0">A0</option>
                </select>
              </div>
              <div className={styles['form-group']}>
                <label>Number of Copies:</label>
                <input type="number" id="copies" min="1" value={copies} onChange={(e) => setCopies(e.target.value)} />
              </div>
              <div className={styles['form-group']}>
                <label>Print Type:</label>
                <select id="printType" value={printType} onChange={(e) => setPrintType(e.target.value)}>
                  <option value="single">Single Side</option>
                  <option value="double">Double Side (Front & Back)</option>
                </select>
              </div>
              <div className={styles['form-group']}>
                <label>Color:</label>
                <select id="colorType" value={colorType} onChange={(e) => setColorType(e.target.value)}>
                  <option value="color">Full Color</option>
                  <option value="bw">Black & White</option>
                </select>
              </div>
            </div>
            <button className={styles['calculate-btn']} onClick={calculatePrice}>Calculate Price</button>
            <div className={styles['price-result']} id="priceResult">{priceResult}</div>
            <button className={showSubmitBtn ? '' : styles.hidden} id="submit-estimated-calc-btn" onClick={sendEstimatedData}>
              Submit estimated price to message
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className={styles['contact-section']}>
        <div className={styles.content}>
          <h1>Contact</h1>
          <div className={styles['contact-content']}>
            <div className={styles['contact-info']}>
              <h3>Our Location</h3>
              <p>STRADA MAIOR ION RACOTEANU NR. 8<br />ET. 1, AP. 3<br />BUCURESTI, Romania</p>
              <p>Phone: +40 XXX XXX XXX</p>
              <p>Email: contact@sovisprint.ro</p>
              <p>Monday - Friday: 9:00 - 18:00<br />Saturday: 10:00 - 14:00</p>
              <div className={styles['map-container']}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.292209922429!2d26.119531676746472!3d44.42716787107605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff20ffcaa443%3A0x662b344932c7a2ce!2sStrada%20Ion%20G.%20Raco%C8%9Beanu%208%2C%20Bucure%C8%99ti%20030167!5e0!3m2!1sen!2sro!4v1761050749559!5m2!1sen!2sro"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                />
              </div>
            </div>
            <div className={styles['contact-form']}>
              <h3>Send Us a Message</h3>
              <form id="contactFormElement" onSubmit={submitContactForm}>
                <input
                  type="text"
                  id="contactName"
                  placeholder="Your Name *"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
                <input
                  type="tel"
                  id="contactPhone"
                  placeholder="Phone Number *"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
                <textarea
                  id="contactMessage"
                  placeholder="Your Message *"
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
                <button type="submit" className={styles['submit-btn']}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className={styles['about-section']}>
        <div className={styles.content}>
          <h1>About</h1>
          <div className={styles['about-content']}>
            <div className={styles['team-image']}>
              Our Professional Team
            </div>
            <div className={styles['about-text']}>
              <p>Sovis Print is a advertising company in Bucharest, specializing in comprehensive printing and
                advertising solutions. With over 10 years of experience, we've helped hundreds of businesses enhance their
                brand visibility.</p>
              <p>Our team of skilled professionals combines creativity with cutting-edge technology to deliver exceptional
                results. From small business cards to large-scale billboard campaigns, we handle projects of all sizes with
                the same dedication and attention to detail.</p>
              <p>We pride ourselves on using only premium materials and the latest printing technology to ensure your
                advertising materials stand out and make a lasting impression.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );

}