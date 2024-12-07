import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProductDetail({ cartItems, setCartItems }) {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle any error state
  const { id } = useParams(); // Extract product ID from the URL

  // Fetch the product details when the component is mounted or `id` changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Set loading state to true while fetching
        const response = await fetch(`${process.env.REACT_APP_API_URL}/product/${id}`);
        
        // Check if the response is not OK
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        setError(error.message); // Capture the error message if something goes wrong
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchProduct();
  }, [id]); // Re-fetch if the `id` changes

  const addToCart = () => {
    if (!product) return; // Prevent adding to cart if product is not loaded

    const itemExist = cartItems.find((item) => item.product._id === product._id);
    
    if (!itemExist) {
      const newItem = { product, qty };
      setCartItems((prevState) => [...prevState, newItem]);
      toast.success('Item added to cart!');
    } else {
      toast.error('This item is already in your cart!');
    }
  };

  const increaseQty = () => {
    if (product && qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return product ? (
    <div className="container container-fluid">
      <div className="row d-flex justify-content-around">
        {/* Product Image */}
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <img
            src={product.images[0].image}
            alt={product.name}
            height="500"
            width="500"
          />
        </div>

        {/* Product Details */}
        <div className="col-12 col-lg-5 mt-5">
          <h3>{product.name}</h3>
          <p id="product_id">Product #{product._id}</p>

          <hr />

          {/* Product Rating */}
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(product.ratings / 5) * 100}%` }}
            ></div>
          </div>

          <hr />

          {/* Product Price */}
          <p id="product_price">${product.price}</p>

          {/* Quantity Selection */}
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" onClick={decreaseQty}>
              -
            </span>

            <input
              type="number"
              className="form-control count d-inline"
              value={qty}
              readOnly
            />

            <span className="btn btn-primary plus" onClick={increaseQty}>
              +
            </span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={product.stock === 0}
            id="cart_btn"
            className="btn btn-primary d-inline ml-4"
          >
            Add to Cart
          </button>

          <hr />

          {/* Product Stock Status */}
          <p>
            Status: <span id="stock_status" className={product.stock > 0 ? 'text-success' : 'text-danger'}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>

          <hr />

          {/* Product Description */}
          <h4 className="mt-2">Description:</h4>
          <p>{product.description}</p>
          <hr />

          {/* Product Seller */}
          <p id="product_seller mb-3">
            Sold by: <strong>{product.seller}</strong>
          </p>

          <div className="rating w-50"></div>
        </div>
      </div>
    </div>
  ) : (
    <div>Product not found.</div> // In case product data is missing
  );
}
