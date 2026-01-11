// src/components/ProductCard.tsx

// displaying a single product in a card format showing its details
// reusable UI component used whenver a product is displayed 



import type { Product } from '../types/types';
import  {Rating } from '@smastrom/react-rating';
// redux hooks and actions allowing us to dispatch actions to the store
import { useAppDispatch } from "../store/hooks"; 
import { addToCart } from "../store/cartSlice"; 

// this is expect a product as prop
const ProductCard: React.FC< {product: Product}> = ({ product }) => {
    // allows program to dispatch actions to the Redux store
    const dispatch = useAppDispatch();
    // UI for a single product card
    return (
        <div className="col-md-3 p-3 d-flex flex-column align-items-center gap-3 shadow">
            <h3>{product.title}</h3>
            <img src={product.image} alt={product.title} className="w-25" />
            <p>${product.price} </p>
            <h5>{product.category.toUpperCase()}</h5>
            {/* react star rating library */}
            <Rating style={{ maxWidth: 100 }} value={product.rating.rate} readOnly/>
            <p>{product.description}</p>
            {/* Button to add product to cart */}
            <button
                className="btn btn-primary"
                onClick={() => dispatch(addToCart(product))}
            >
                Add to Cart
            </button>
        </div>
    )
}

export default ProductCard