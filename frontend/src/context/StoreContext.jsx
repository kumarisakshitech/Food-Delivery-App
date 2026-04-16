import { createContext, useEffect, useState } from "react";
import { food_list as defaultFoodList } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState(defaultFoodList);

    // Backend URL
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

    // ------------------- CART FUNCTIONS -------------------

    const addToCart = (id) => {
        setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id) => {
        setCartItems(prev => {
            if (!prev[id]) return prev;
            const updated = { ...prev, [id]: prev[id] - 1 };
            if (updated[id] <= 0) delete updated[id];
            return updated;
        });
    };

    const getTotalCartAmount = () => {
        return Object.keys(cartItems).reduce((acc, id) => {
            const item = food_list.find(item => item._id === id);
            return item ? acc + item.price * cartItems[id] : acc;
        }, 0);
    };

    const clearCart = () => setCartItems({});

    // ------------------- LOCAL STORAGE -------------------

    useEffect(() => {
        const saved = localStorage.getItem("cartItems");
        if (saved) setCartItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    // ------------------- FETCH FOOD LIST -------------------

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const res = await fetch(`${url}/api/food/list`);
                if (!res.ok) throw new Error("Failed to fetch food list");
                const data = await res.json();
                // If API returns data, use it; otherwise fallback to default list to keep homepage populated
                if (data.data && data.data.length > 0) {
                    setFoodList(data.data);
                } else {
                    setFoodList(defaultFoodList);
                }
            } catch (err) {
                console.warn("Could not fetch food list. Using default.", err);
                setFoodList(defaultFoodList);
            }
        };
        fetchFood();
    }, [url]);

    // ------------------- PLACE ORDER -------------------

    const placeOrder = async (address) => {
        if (!token) {
            alert("Please login to place an order");
            return;
        }

        const items = Object.keys(cartItems).map((id) => {
            const item = food_list.find((f) => f._id === id);
            return item
                ? { _id: id, name: item.name, price: item.price, quantity: cartItems[id] }
                : null;
        }).filter(Boolean);

        if (items.length === 0) {
            alert("Cart is empty");
            return;
        }

        const amount = getTotalCartAmount();

        try {
            const res = await fetch(`${url}/api/order/placeOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ items, amount, address }),
            });

            const data = await res.json();
            if (data.success && data.session_url) {
                window.location.href = data.session_url; // redirect to Stripe Checkout
            } else {
                console.error("Order failed:", data.message);
                alert("Order failed: " + data.message);
            }
        } catch (err) {
            console.error("Error placing order:", err);
            alert("Error placing order. Try again.");
        }
    };

    // ------------------- PROVIDER -------------------

    return (
        <StoreContext.Provider value={{
            food_list,
            cartItems,
            addToCart,
            removeFromCart,
            getTotalCartAmount,
            clearCart,
            token,
            setToken,
            url,
            placeOrder
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
