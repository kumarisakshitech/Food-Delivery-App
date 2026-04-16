import React, { useEffect } from "react";
import './Verify.css';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Verify = () => {
  const Navigate = useNavigate();
  const [params] = useSearchParams();
  const success = params.get("success");
  const orderId = params.get("orderId");
  const {url} = useContext(StoreContext);

  const verifyPayment = async () => {
    const response = await axios.post(url+"/api/order/verify",{success,orderId});
    if(response.data.success){
      Navigate("/myorders");
    }
    else{
      Navigate("/");
    }
  }
  useEffect(() => {
    verifyPayment();
  }, []);

  return (
  <div className="verify">
    <div className="spinner">

    </div>

  </div>
  )
}

export default Verify;
