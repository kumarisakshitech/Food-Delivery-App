import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import axios from "axios";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // PLACE ORDER ===========================
  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must login first before placing an order!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in! Login to continue.");
      return;
    }

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      userId,
      items: orderItems,
      amount: getTotalCartAmount() + 40,
      address: data,
    };

    try {
      const response = await axios.post(
        `${url}/api/order/placeOrder`,   // 🔥 fixed endpoint
        orderData,
        { headers: { Authorization: `Bearer ${token}` }} // 🔥 token attached
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url); // redirect to Stripe
      } else {
        alert("Order error: " + response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Order failed. Try again.");
    }
  };

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <h2>Delivery Information</h2>

        <div className="two-inputs">
          <input name="firstName" placeholder="First Name" onChange={onChangeHandler} required />
          <input name="lastName" placeholder="Last Name" onChange={onChangeHandler} required />
        </div>

        <input name="email" placeholder="Email Address" onChange={onChangeHandler} required />
        <input name="street" placeholder="Street Address" onChange={onChangeHandler} required />

        <div className="two-inputs">
          <input name="city" placeholder="City" onChange={onChangeHandler} required />
          <input name="state" placeholder="State" onChange={onChangeHandler} required />
        </div>

        <div className="two-inputs">
          <input name="zipcode" placeholder="Zip Code" onChange={onChangeHandler} required />
          <input name="country" placeholder="Country" onChange={onChangeHandler} required />
        </div>

        <input name="phone" placeholder="Phone Number" onChange={onChangeHandler} required />
      </div>

      <div className="place-order-right">
        <h3>Order Summary</h3>
        <div className="summary-box">
          <div className="summary-row">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <div className="summary-row">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
          </div>
          <hr />
          <div className="summary-row">
            <b>Total</b>
            <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}</b>
          </div>

          <button type="submit" className="payment-btn">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
