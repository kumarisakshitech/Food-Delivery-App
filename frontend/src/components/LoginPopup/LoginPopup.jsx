import React, { useState, useEffect, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({ setShowLogin }) => {

    const [currState, setCurrState] = useState("Login");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const { setToken, url } = useContext(StoreContext);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await fetch(newUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // If the response is not ok (e.g., 400 or 500 error), parse and show message
                const errorResult = await response.json();
                alert(errorResult.message || "An error occurred");
                return;
            }

            const result = await response.json();

            if (result.success) {
                setToken(result.token);
                localStorage.setItem("token", result.token);

                // 🔥 Fix: Store userId correctly (now provided by backend)
                if (result.userId) {
                    localStorage.setItem("userId", result.userId);
                }

                alert(currState === "Login" ? "Login successful!" : "Account created!");
                setShowLogin(false);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Failed to connect to the server. Please check your internet connection or try again later.");
        }
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <div className="login-popup">
            <form className="login-popup-container" onSubmit={onSubmitHandler}>

                {/* Title + Close Button */}
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt="close"
                        className="close-icon"
                    />
                </div>

                {/* Input Fields */}
                <div className="login-popup-inputs">

                    {currState !== "Login" && (
                        <input
                            name="name"
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}

                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your email"
                        required
                    />

                    <input
                        name="password"
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-btn">
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {/* Terms */}
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, you agree to the Terms of Service & Privacy Policy.</p>
                </div>

                {/* Switch Login / Signup */}
                {currState === "Login" ? (
                    <p className="toggle-text">
                        New here?
                        <span onClick={() => setCurrState("Sign Up")}> Create an account</span>
                    </p>
                ) : (
                    <p className="toggle-text">
                        Already have an account?
                        <span onClick={() => setCurrState("Login")}> Login here</span>
                    </p>
                )}

            </form>
        </div>
    );
};

export default LoginPopup;
