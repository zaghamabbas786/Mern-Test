import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import axios from "axios";
import { getAllProduct, productByPrice, searchAndFilterProducts } from "../../admin/products/FetchApi";
import "./style.css";

const apiURL = process.env.REACT_APP_API_URL;

// Public version of getAllCategory (no auth required)
const getAllCategory = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="py-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories && categories.length > 0 ? (
          categories.map((item, index) => {
            return (
              <Fragment key={index}>
                <div
                  onClick={(e) =>
                    history.push(`/products/category/${item._id}`)
                  }
                  className="col-span-1 m-2 flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <img
                    src={`${apiURL}/uploads/categories/${item.cImage}`}
                    alt="pic"
                  />
                  <div className="font-medium">{item.cName}</div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <div className="text-xl text-center my-4">No Category</div>
        )}
      </div>
    </div>
  );
};

const SearchAndFilter = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState(null);
  const [productArray, setPa] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      let responseData = await getAllProduct();
      if (responseData && responseData.Products) {
        setPa(responseData.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchAndFilter = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await searchAndFilterProducts(
          title,
          category,
          minPrice,
          maxPrice
        );
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  const handleReset = () => {
    setTitle("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    dispatch({ type: "setProducts", payload: productArray });
  };

  const closeSearchFilterBar = () => {
    handleReset();
    dispatch({ type: "searchFilterDropdown", payload: !data.searchFilterDropdown });
  };

  return (
    <div className={`${data.searchFilterDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col space-y-4 py-4">
        <div className="flex justify-between items-center">
          <div className="font-medium text-lg">Filter & Search</div>
          <div onClick={(e) => closeSearchFilterBar()} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Search by Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-700"
              type="text"
              placeholder="Enter product title..."
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Search by Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-700"
            >
              <option value="">All Categories</option>
              {categories && categories.length > 0
                ? categories.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.cName}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </div>

        {/* Price Range Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="minPrice" className="text-sm font-medium">
              Minimum Price ($)
            </label>
            <input
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-700"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="maxPrice" className="text-sm font-medium">
              Maximum Price ($)
            </label>
            <input
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-700"
              type="number"
              min="0"
              step="0.01"
              placeholder="1000.00"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSearchAndFilter}
            className="px-6 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-700"
          >
            Apply Filter & Search
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <SearchAndFilter />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
