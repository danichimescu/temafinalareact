import { useState } from 'react';
import styles from './Comanda.module.css';

const formatPrices = {
  'A5': 0.5,
  'A4': 0.8,
  'A3': 2,
  'SRA3': 2.5,
  'A2': 4,
  'A1': 8,
  'A0': 15
};

export function OrderForm({ onSendToContact }) {
  const [serviceType, setServiceType] = useState('');
  const [printFormat, setPrintFormat] = useState('A5');
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState('single');
  const [colorType, setColorType] = useState('color');
  const [priceResult, setPriceResult] = useState('');
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [orderToSend, setOrderToSend] = useState(null);

  function updateOrderForm(value) {
    setServiceType(value);
    setShowSubmitBtn(false);
    setPriceResult('');
  }

  function calculatePrice() {
    let price = 0;
    let finalprice = 0;

    if (serviceType === 'printing') {
      const copiesNum = parseInt(copies) || 1;

      price = formatPrices[printFormat] * copiesNum;
      finalprice = price;

      if (printType === 'double') {
        finalprice = price * 1.8;
      }
      if (colorType === 'color') {
        finalprice = price * 1.5;
      }
      if (colorType === 'color' && printType === 'double') {
        finalprice = price * 1.5 * 1.8;
      }

      const order = {
        serviceType: serviceType,
        format: printFormat,
        copies: copiesNum,
        printType: printType,
        colorType: colorType,
        finalprice: finalprice
      };

      setOrderToSend(order);
      setShowSubmitBtn(true);
    }

    setPriceResult(`Estimated Price: ${finalprice.toFixed(2)} RON`);
  }

  function sendEstimatedData() {
    if (!orderToSend) return;

    const message = `
Dear Sovis Print Team,

I would like to place an order with the following details:

Service Type: ${orderToSend.serviceType}
Format: ${orderToSend.format}
Copies: ${orderToSend.copies}
Print Type: ${orderToSend.printType}
Color Type: ${orderToSend.colorType}
Final Price: ${orderToSend.finalprice.toFixed(2)} RON
    `.trim();

    // Call parent callback to send message to contact form
    if (onSendToContact) {
      onSendToContact(message);
    }

    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className={styles['order-form']}>
      <div className={styles['form-group']}>
        <label>Service Type:</label>
        <select
          value={serviceType}
          onChange={(e) => updateOrderForm(e.target.value)}
        >
          <option value="">Select Service</option>
          <option value="printing">Printing</option>
          <option value="3d-letters">3D Letters</option>
          <option value="stickers">Stickers</option>
          <option value="billboards">Billboard Materials</option>
          <option value="promotional">Promotional Items</option>
        </select>
      </div>

      {/* Printing Options - only shown when printing is selected */}
      {serviceType === 'printing' && (
        <div id="printingOptions">
          <div className={styles['form-group']}>
            <label>Format:</label>
            <select
              value={printFormat}
              onChange={(e) => setPrintFormat(e.target.value)}
            >
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
            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>

          <div className={styles['form-group']}>
            <label>Print Type:</label>
            <select
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
            >
              <option value="single">Single Side</option>
              <option value="double">Double Side (Front & Back)</option>
            </select>
          </div>

          <div className={styles['form-group']}>
            <label>Color:</label>
            <select
              value={colorType}
              onChange={(e) => setColorType(e.target.value)}
            >
              <option value="color">Full Color</option>
              <option value="bw">Black & White</option>
            </select>
          </div>
        </div>
      )}

      <button
        className={styles['calculate-btn']}
        onClick={calculatePrice}
      >
        Calculate Price
      </button>

      {priceResult && (
        <div className={styles['price-result']}>
          {priceResult}
        </div>
      )}

      {showSubmitBtn && (
        <button
          className={styles['calculate-btn']}
          onClick={sendEstimatedData}
        >
          Submit estimated price to message
        </button>
      )}
    </div>
  );
}
