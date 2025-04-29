import React from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import Image1 from "../../../assets/Adobo.png";

const foodItems = [
  {
    id: 4,
    name: "Lechon Kawali",
    price: "₱230",
    description: "Crispy pan-fried pork belly with liver sauce.",
    image: Image1,
    packages: [
      { name: "Rice Platter", price: "₱100" },
      { name: "Softdrinks (1L)", price: "₱60" },
      { name: "Side Dish (Atchara)", price: "₱50" },
    ],
  },
  {
    id: 7,
    name: "Whole Lechon",
    price: "₱6,500",
    description: "Traditional Filipino roasted whole pig. Perfect for fiestas.",
    image: Image1,
    packages: [
      { name: "Lechon Sauce (1L)", price: "₱150" },
      { name: "10x Rice Packets", price: "₱250" },
      { name: "Softdrinks Case (12 bottles)", price: "₱400" },
      { name: "Dessert Sampler (Leche Flan, Kutsinta)", price: "₱300" },
    ],
  },
  {
    id: 8,
    name: "Pancit Bilao",
    price: "₱450",
    description:
      "Party-size stir-fried noodles topped with meat and vegetables.",
    image: Image1,
    packages: [
      { name: "Lumpia Platter", price: "₱200" },
      { name: "Iced Tea Gallon", price: "₱120" },
      { name: "Mini Leche Flan", price: "₱80" },
    ],
  },
  {
    id: 9,
    name: "Inihaw na Liempo",
    price: "₱220",
    description: "Grilled pork belly marinated in local spices.",
    image: Image1,
    packages: [
      { name: "Java Rice", price: "₱40" },
      { name: "Grilled Veggies", price: "₱70" },
      { name: "Mango Sago", price: "₱90" },
    ],
  },
];

const PackagesSection_main = () => {
  return (
    <section className="food-grid-section container-fluid">
      <div className="container">
        
        <div className="food-grid">
          {foodItems.map((item) => (
            <div className="food-card" key={item.id}>
              <img src={item.image} alt={item.name} className="food-image" />
              <div className="food-info">
                <div className="food-header">
                  <h3 className="food-name">{item.name}</h3>
                  <span className="food-price">{item.price}</span>
                </div>
                <div className="food-stars">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} color="#ff9900" size={14} />
                    ))}
                </div>
                <p className="food-description">{item.description}</p>

                <div className="food-packages">
                  <strong>Available Packages:</strong>
                  <ul className="package-list">
                    {item.packages.map((pkg, index) => (
                      <li key={index}>
                        {pkg.name} - <span>{pkg.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="food-footer">
                  <button className="food-button">Order Now</button>
                  <FaShoppingCart className="cart-icon" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection_main;
