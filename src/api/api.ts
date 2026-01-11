// src/api/api.ts

// centrailizing API calls to Fake Store API using axios, able to reuse and change if needed

import axios from 'axios';
import type { Product, Category } from '../types/types';


// creating an axios instance with base URL
const apiClient = axios.create({
    baseURL: 'https://fakestoreapi.com'
});

// creating functions to fetch data
// fetch all products using GET request
// export const fetchProducts = async (): Promise<AxiosResponse<Product[]>> => apiClient.get<Product[]>('/products');
export const fetchProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
};
// 

// fetch products by category
// export const fetchCategories = async (): Promise<AxiosResponse<Category[]>> => apiClient.get<Category[]>('/products/categories');
export const fetchCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/products/categories');
    return response.data;
};

// now we can implement our react query by wrapping <queryClientProvider> around our app in App.tsx