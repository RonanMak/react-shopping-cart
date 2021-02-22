import { FETCH_PRODUCTS } from "../types";
import { FILTER_PRODUCTS_BY_SIZE, ORDER_PRODUCTS_BY_PRICE } from "../types";

export const fetchProducts = () => async (dispatch) => {
  const res = await fetch("/api/products");
  // the data comes from Fitch method need to be converted to JSON
  // below ... the JSON file return Promose, make it await
  const data = await res.json();
  console.log(data);
  dispatch({
    type: FETCH_PRODUCTS,
    payload: data,
  });
};

//takes two params 1. all products 2.the sizes we need to filter
export const filterProducts = (products, size) => (dispatch) => {
  dispatch({
    type: FILTER_PRODUCTS_BY_SIZE,
    // gonna send an object and it contains two value. 1. the selected size and filtered products
    payload: {
      size: size,
      items:
        size === ""
          ? products
          : products.filter((x) => x.availableSizes.indexOf(size) >= 0),
    },
  });
};

export const sortProducts = (filteredProducts, sort) => (dispatch) => {
  const sortedProducts = filteredProducts.slice();
  // "" means sorted by _id
  if (sort === "latest") {
    sortedProducts.sort((a, b) => (a._id > b._id ? 1 : -1));
    // sorted by price
  } else {
    sortedProducts.sort((a, b) =>
      sort === "lowest"
        ? //lowest to highest
          a.price > b.price
          ? 1
          : -1
        : //highest to lowest
        a.price > b.price
        ? -1
        : 1
    );
  }
  console.log(sortedProducts);
  dispatch({
    type: ORDER_PRODUCTS_BY_PRICE,
    payload: {
      sort: sort,
      items: sortedProducts,
    },
  });
};
