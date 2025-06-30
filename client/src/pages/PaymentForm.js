import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentForm = ({ amount, courseId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:4000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('ຊຳລະເງິນສຳເລັດ!');
        console.log('User token:', user?.token);

        const purchaseRes = await fetch('http://localhost:4000/api/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ 
            courseId, 
            price: amount 
          }),
        });

        if (!purchaseRes.ok) {
          const errData = await purchaseRes.json();
          setError(errData.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກການຊື້');
          setLoading(false);
          return;
        }

        navigate(`/learn/${courseId}`);
      }
    } catch (err) {
      console.error('ເກີດຂໍ້ຜິດພາດໃນການຊຳລະເງິນ:', err);
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md shadow-sm">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition disabled:opacity-50"
      >
        {loading ? 'ກຳລັງຊຳລະເງິນ...' : 'ຊຳລະເງິນ'}
      </button>
    </form>
  );
};

export default PaymentForm;
