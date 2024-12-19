import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

export default function Cart({ cartItems, setCartItems }) {
    const [complete, setComplete] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        address: '',
        country: ''
    });

    const navigate = useNavigate();

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Adjust quantities
    function increaseQty(item) {
        if (item.product.stock === item.qty) {
            return;
        }
        const updatedItems = cartItems.map((i) => {
            if (i.product._id === item.product._id) {
                i.qty++;
            }
            return i;
        });
        setCartItems(updatedItems);
    }

    function decreaseQty(item) {
        if (item.qty > 1) {
            const updatedItems = cartItems.map((i) => {
                if (i.product._id === item.product._id) {
                    i.qty--;
                }
                return i;
            });
            setCartItems(updatedItems);
        }
    }

    function removeItem(item) {
        const updatedItems = cartItems.filter((i) => i.product._id !== item.product._id);
        setCartItems(updatedItems);
    }

    // Place order
    function placeOrderHandler() {
        const { name, email, contactNumber, address, country } = formData;

        // Validate form data
        if (!name || !email || !contactNumber || !address || !country) {
            toast.error("Please fill in all fields.");
            return;
        }

        const totalAmount = Number(cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)).toFixed(2);

        // Prepare the data to send to the backend
        const data = {
            cartItems,
            name,
            email,
            contactNumber,
            address,
            country,
            amount: Number(cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)).toFixed(2)
        };

        //api call
        fetch(process.env.REACT_APP_API_URL + '/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(() => {
                setCartItems([]);
                setComplete(true);
                toast.success("Order placed successfully!");
                navigate('/payment', { state: { totalAmount } });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to place the order.");
            });
    }

    return cartItems.length > 0 ? (
        <Fragment>
            <div className="container container-fluid">
                <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8">
                        {cartItems.map((item) => (
                            <Fragment key={item.product._id}>
                                <hr />
                                <div className="cart-item">
                                    <div className="row">
                                        <div className="col-4 col-lg-3">
                                            <img
                                                src={item.product.images[0].image}
                                                alt={item.product.name}
                                                height="90"
                                                width="115"
                                            />
                                        </div>

                                        <div className="col-5 col-lg-3">
                                            <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                                        </div>

                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p id="card_item_price">${item.product.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <div className="stockCounter d-inline">
                                                <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>-</span>
                                                <input
                                                    type="number"
                                                    className="form-control count d-inline"
                                                    value={item.qty}
                                                    readOnly
                                                />
                                                <span className="btn btn-primary plus" onClick={() => increaseQty(item)}>+</span>
                                            </div>
                                        </div>

                                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                            <i
                                                id="delete_cart_item"
                                                onClick={() => removeItem(item)}
                                                className="fa fa-trash btn btn-danger"
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </div>

                    <div className="col-12 col-lg-3 my-4">
                        <div id="order_summary">
                            <h4>Checkout</h4>
                            <form>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Number:</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        className="form-control"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Country:</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className="form-control"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </form>

                            <hr />
                            <p>
                                Subtotal: <span className="order-summary-values">{cartItems.reduce((acc, item) => acc + item.qty, 0)} (Units)</span>
                            </p>
                            <p>
                                Est. total: <span className="order-summary-values">${Number(cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)).toFixed(2)}</span>
                            </p>

                            <hr />
                            <button id="checkout_btn" onClick={placeOrderHandler} className="btn btn-primary btn-block">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    ) : !complete ? (
        <h2 className="mt-5">Your Cart is Empty!</h2>
    ) : (
        <Fragment>
            <h2 className="mt-5">Order Complete!</h2>
            <p>Your order has been placed successfully.</p>
        </Fragment>
    );
}
