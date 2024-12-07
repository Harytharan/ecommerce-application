import React, { useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

export default function PaymentPage() {
    const location = useLocation();
    const totalAmount = location.state?.totalAmount;
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    const [paymentSuccess, setPaymentSuccess] = useState(false);  // New state to track payment success

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { cardNumber, expiryDate, cvc } = formData;

        // Validate input
        if (!cardNumber || !expiryDate || !cvc) {
            toast.error('Please fill in all fields.');
            return;
        }

        // Mock payment success (can be connected to a payment API)
        setTimeout(() => {
            toast.success('Thank you for purchasing!');
            setPaymentSuccess(true);  // Set paymentSuccess to true when payment is successful
        }, 1000);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                {paymentSuccess ? (
                    <Fragment>
                        <h2 className="mt-5">Order Complete!</h2>
                        <p>Your order has been placed successfully.</p>
                    </Fragment>
                ) : (
                    <>
                        <h2 className="mb-4 text-center">Card Info</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 1234 1234 1234"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Card Expiry</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    onFocus={(e) => (e.target.type = 'month')}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Card CVC</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cvc"
                                    value={formData.cvc}
                                    onChange={handleInputChange}
                                    placeholder="CVC"
                                />
                            </div>
                            <button type="submit" className="btn btn-warning btn-block ">
                                Pay - ${totalAmount}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
