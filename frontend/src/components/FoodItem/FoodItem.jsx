import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import './FoodItem.css'

const FoodItem = ({ id, name, price, description, image }) => {
    
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)

    return (
        <div className="food-item">

            {/* IMAGE + ADD BUTTON / COUNTER */}
            <div className="food-item-img-container">
                <img className="food-item-image" src={image} alt={name} />

            {/* If itemCount = 0 → show plus button */}
                {!cartItems[id] || cartItems[id] === 0 ? (
                    <img 
                        className="add" 
                        src={assets.add_icon_white} 
                        alt="add" 
                        onClick={() => addToCart(id)}
                    />
                ) : (
                    <div className="food-item-counter">
                        <img 
                            src={assets.remove_icon_red} 
                            alt="remove" 
                            onClick={() => removeFromCart(id)}
                        />
                        <p>{cartItems[id]}</p>
                        <img 
                            src={assets.add_icon_green} 
                            alt="add-more" 
                            onClick={() => addToCart(id)}
                        />
                    </div>
                )}
            </div>


            {/* FOOD DETAILS */}
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="rating-stars" />
                </div>

                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₹{price}</p>
            </div>

        </div>
    )
}

export default FoodItem
