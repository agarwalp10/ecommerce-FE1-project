// src/pages/Home.tsx

// Product Listing Page - displays all products
// fetching products and categories using react query
// able to filter products by category
// button to go to cart page and add to cart functionality
// react query for server state management
// redux for client state management (cart)
// local state for UI-only state (selected category)

import { useMemo, useState } from "react";
import type { Product, Category } from '../types/types';
import ProductCard from '../components/ProductCard';
// react query hooks and api functions to manage server state
import { useQuery } from '@tanstack/react-query';
// api functions to fetch products and categories from Fake Store API
import { fetchProducts, fetchCategories } from '../api/api';
// react router link to navigate to cart page
import { Link } from "react-router-dom";
// redux hook to get cart count from store
import { useAppSelector } from "../store/hooks";

const Home: React.FC = () => {

    // UI-only state --> local useState for selected category controlling filtering on this page 
    const [selectedCategory, setSelectedCategory] = useState('');

    //* using react query to fetch products and categories

    // =====PRODUCT DATA======
    const { 
        data: products = [],
        isLoading, 
        error 
    } = useQuery({
        // query key is needed for caching
        queryKey: ['products'],
        // to fetch products we call the fetchProducts function
        queryFn: fetchProducts,
    });


    // =====CATEGORY DATA - dynamic filtering=====
    const { data: categories } = useQuery({
        // query key is needed for caching
        queryKey: ['categories'],
        // to fetch products we call the fetchProducts function
        queryFn: fetchCategories,
    });

    // getting cart count from Redux store - global state
    // updates whenever cart state changes automatically
    const cartCount = useAppSelector((s) =>
        s.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    );
    // filtering component to dynamically update it from products + selected category
    // function for filtering (used useMemo for performance optimization)
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "") return products;
        return products.filter((p: Product) => p.category === selectedCategory);
    }, [products, selectedCategory]);
    

    // UI for Home page
    return (
        <div className="container py-3">
            {/* header for filtering and cart */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex gap-2 align-items-center">

                    <select 
                        onChange={(e) => setSelectedCategory(e.target.value)
                        }
                        value={selectedCategory } 
                    >
                        <option value="">All Categories</option>

                        {categories?.map((category:Category) => (
                            <option value={category} key={category}>{category}</option>
                        ))}
                    </select>
                    <button 
                        className='btn' 
                        onClick={()=> setSelectedCategory('')}
                        >
                        Clear Filter
                    </button>
                </div>
                <Link to="/cart" className="btn btn-outline-primary">
                Cart ({cartCount})
                </Link>
            </div>
            {isLoading && <h1>Loading...</h1>}
            {error && <p>Something went wrong loading products.</p>}

            {/* product cards */}
            <div className="d-flex flex-wrap gap-3 justify-content-center">
                {filteredProducts.map((product: Product) => (
                    // passing down this product as prop to ProductCard
                    <ProductCard product={product} key={product.id } />
                    
                ))}
            </div>
        </div>
    );
};

export default Home