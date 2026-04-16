import { useState } from 'react'
import { assets } from '../../assets/assets'
import './FoodItem.css'

const FoodItem = ({ id, name, price, description, image }) => {
    
    const [itemCount, setItemCount] = useState(0)

    return (
        <div className="food-item">

            {/* IMAGE + ADD BUTTON / COUNTER */}
            <div className="food-item-img-container">
                <img className="food-item-image" src={image} alt={name} />

                {/* If itemCount = 0 → show plus button */}
                {itemCount === 0 ? (
                    <img 
                        className="add" 
                        src={assets.add_icon_white} 
                        alt="add" 
                        onClick={() => setItemCount(prev => prev + 1)}
                    />
                ) : (
                    <div className="food-item-counter">
                        <img 
                            src={assets.remove_icon_red} 
                            alt="remove" 
                            onClick={() => setItemCount(prev => Math.max(prev - 1, 0))}
                        />
                        <p>{itemCount}</p>
                        <img 
                            src={assets.add_icon_green} 
                            alt="add-more" 
                            onClick={() => setItemCount(prev => prev + 1)}
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
