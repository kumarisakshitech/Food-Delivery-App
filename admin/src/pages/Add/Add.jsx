import React, { useEffect, useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
  
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "salad"
  });

  // Input change handler
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  // Form submit handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "salad"
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Server error! Please check backend logs.");
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className='add-img-upload flex-col'>
          <p>Upload Image</p>
          <label htmlFor='image'>
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className='add-product-name flex-col'>
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>

        <div className='add-product-description flex-col'>
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        <div className='add-category-price'>
          <div className='add-category flex-col'>
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="salad">Salad</option>
              <option value="rolls">Rolls</option>
              <option value="desserts">Desserts</option>
              <option value="sandwich">Sandwich</option>
              <option value="cake">Cake</option>
              <option value="pure veg">Pure Veg</option>
              <option value="pasta">Pasta</option>
              <option value="noodles">Noodles</option>
            </select>
          </div>

          <div className='add-price flex-col'>
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name='price'
              placeholder='$20'
              required
            />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default Add;
