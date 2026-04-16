import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
    const {food_list} = useContext(StoreContext)

    console.log("food_list length:", food_list.length, "category:", category);

    const filtered = food_list.filter(item => category === "All" || category === item.category);
    console.log("filtered length:", filtered.length);

  return (
    <div className='food-display' id='food-display'>
    <h2>Top dishes near you</h2>
    <div className="food-display-list">
      {filtered.map((item, index) => (
        <FoodItem key={item._id || index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
      ))}
    </div>
    </div>
  )
}

export default FoodDisplay