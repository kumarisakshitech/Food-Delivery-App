import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        setOrders(res.data.data.reverse());
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const updateStatus = async (e, orderId) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: e.target.value,
      });
      if (res.data.success) {
        toast.success("Status updated");
        fetchOrders();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, i) => (
          <div key={i} className="order-item">
            <img src={assets.parcel_icon} alt="parcel" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address?.street},</p>
                <p>{order.address?.city}, {order.address?.state}, {order.address?.country}</p>
              </div>
              <p className="order-item-phone">{order.address?.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>
            <select onChange={(e) => updateStatus(e, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
