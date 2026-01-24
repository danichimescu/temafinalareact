import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../Auth/AuthContext';
import { processServerResponse } from '../../utils';
import { toast } from 'react-toastify';

import styles from './Comanda.module.css';

const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = `${apiUrl}/comanda`;

//key object, like a dictionary, : define a proprety
const formatPrices = {
  'A5': 0.5,
  'A4': 0.8,
  'A3': 2,
  'SRA3': 2.5,
  'A2': 4,
  'A1': 8,
  'A0': 15
};

export function Comanda() {
  // Orders list state
  const [orders, setOrders] = useState(null);

  // Order form state
  const [serviceType, setServiceType] = useState('');
  const [printFormat, setPrintFormat] = useState('A5');
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState('single');
  const [colorType, setColorType] = useState('color');
  const [priceResult, setPriceResult] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);

  const { accessToken, user } = useAuthContext();
  const navigate = useNavigate();

  const authHeader = useMemo(() => ({
    Authorization: `Bearer ${accessToken}`,
  }), [accessToken]);

  // READ/RETRIEVE - Fetch user's orders
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetch(`${endpoint}?userId=${user.id}`, {
      headers: authHeader,
    })
      .then(processServerResponse)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      });
  }, [authHeader, user?.id]);

  // Update form when service type changes
  function updateOrderForm(value) {
    setServiceType(value);
    setShowSubmitBtn(false);
    setPriceResult('');
    setCalculatedPrice(0);
  }

  // Calculate price based on selections
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

      setCalculatedPrice(finalprice);
      setShowSubmitBtn(true);
      setPriceResult(`Estimated Price: ${finalprice.toFixed(2)} RON`);
    } else if (serviceType) {
      // For other services, show a message to contact for quote
      setPriceResult('Please contact us for a custom quote.');
      setShowSubmitBtn(true);
      setCalculatedPrice(0);
    }
  }

  // CREATE - Submit order to server
  async function handleSubmitOrder() {
    if (!serviceType) {
      toast.error('Please select a service type');
      return;
    }

    const orderData = {
      serviceType: serviceType,
      format: serviceType === 'printing' ? printFormat : null,
      //parseInt() can return NaN if the input is invalid 
      copies: serviceType === 'printing' ? parseInt(copies) || 1 : null,
      printType: serviceType === 'printing' ? printType : null,
      colorType: serviceType === 'printing' ? colorType : null,
      price: calculatedPrice,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    try {
      const newOrder = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
      }).then(processServerResponse);

      const newOrdersList = [...orders, newOrder];
      setOrders(newOrdersList);

      // Reset form
      setServiceType('');
      setPrintFormat('A5');
      setCopies(1);
      setPrintType('single');
      setColorType('color');
      setPriceResult('');
      setCalculatedPrice(0);
      setShowSubmitBtn(false);

      toast.success('Order submitted successfully!');
    } catch (e) {
      console.warn(e);
      toast.error('Failed to submit order');
    }
  }

  // DELETE - Remove order
  async function handleDeleteOrder(order) {
    try {
      await fetch(`${endpoint}/${order.id}`, {
        method: 'DELETE',
        headers: authHeader
      });

      const newOrdersList = orders.filter((o) => o.id !== order.id);
      setOrders(newOrdersList);
      toast.success('Order deleted');
    } catch (e) {
      console.warn(e);
      toast.error('Failed to delete order');
    }
  }

  // UPDATE - Mark order as completed
  async function handleCompleteOrder(order) {
    try {
      const updatedOrder = await fetch(`${endpoint}/${order.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: !order.completed,
        }),
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
      }).then(processServerResponse);

      const indexOfOldOrder = orders.findIndex((o) => o.id === order.id);
      const newOrdersList = orders.toSpliced(indexOfOldOrder, 1, updatedOrder);
      setOrders(newOrdersList);
    } catch (e) {
      console.warn(e);
      toast.error('Failed to update order');
    }
  }

  // Format order details for display
  function formatOrderDetails(order) {
    if (order.serviceType === 'printing') {
      return `${order.format}, ${order.copies} copies, ${order.printType}, ${order.colorType} - ${order.price.toFixed(2)} RON`;
    }
    return order.serviceType;
  }

  // Send checked orders to email (contact form)
  function handleSendToEmail() {
    const checkedOrders = orders?.filter((order) => order.completed) || [];

    if (checkedOrders.length === 0) {
      toast.warning('Please check at least one order to send');
      return;
    }

    // Calculate total price
    const totalPrice = checkedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

    // Format message with all checked orders
    const ordersList = checkedOrders.map((order, index) => {
      if (order.serviceType === 'printing') {
        return `${index + 1}. ${order.serviceType.toUpperCase()}
   - Format: ${order.format}
   - Copies: ${order.copies}
   - Print Type: ${order.printType}
   - Color: ${order.colorType}
   - Price: ${order.price.toFixed(2)} RON`;
      }
      return `${index + 1}. ${order.serviceType.toUpperCase()}`;
    }).join('\n\n');

    const message = `Dear Sovis Print Team,

I would like to place the following order(s):

${ordersList}

TOTAL: ${totalPrice.toFixed(2)} RON

Please contact me to confirm the order.

Thank you!`;

    // Save to localStorage for Mainpage to read
    localStorage.setItem('orderMessage', message);
    localStorage.setItem('orderName', user.firstName || '');
    localStorage.setItem('orderPhone', user.phone || '');

    // Navigate to main page first
    navigate('/');

    // Scroll to sendamessage section after navigation
    setTimeout(() => {
      const element = document.getElementById('sendamessage');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    toast.success('Redirecting to contact form...');
  }

  // Check if there are any checked orders
  const hasCheckedOrders = orders?.some((order) => order.completed) || false;

  return (
    <div className={styles.comandaContainer}>
      <h1>Make an Order</h1>

      {/* Order Form */}
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
          <div className={styles.printingOptions}>
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
          disabled={!serviceType}
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
            className={styles['submit-btn']}
            onClick={handleSubmitOrder}
          >
            Submit Order
          </button>
        )}
      </div>

      {/* Orders List */}
      <h2>Your Orders</h2>
      {!orders && <strong>Loading...</strong>}

      {orders?.length > 0 && (
        <ul className={styles.ordersList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <label className={order.completed ? styles.completed : ''}>
                <input
                  type="checkbox"
                  checked={order.completed}
                  onChange={() => handleCompleteOrder(order)}
                />
                <span className={styles.orderType}>{order.serviceType}</span>
                {order.serviceType === 'printing' && (
                  <span className={styles.orderDetails}>
                    {formatOrderDetails(order)}
                  </span>
                )}
              </label>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleDeleteOrder(order)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      {orders?.length === 0 && <p>No orders yet. Create one above!</p>}

      {/* Send to Email Button */}
      {hasCheckedOrders && (
        <button
          className={styles['send-email-btn']}
          onClick={handleSendToEmail}
        >
          Send Checked Orders to Email
        </button>
      )}
    </div>
  );
}
