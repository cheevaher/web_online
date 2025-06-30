// server/routes/paymentRoutes.js
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('sk_test_...'); // ✅ ใส่ test key ของคุณตรงนี้

router.post('/create-checkout-session', async (req, res) => {
  const { courseId, courseName, coursePrice, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'thb',
          product_data: { name: courseName },
          unit_amount: parseInt(coursePrice * 100),
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/learn/${courseId}?success=true`,
      cancel_url: `http://localhost:5173/course/${courseId}?canceled=true`,
      metadata: {
        userId,
        courseId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'ບໍ່ສາມາດສ້າງ session ການຊຳລະເງິນໄດ້' });
  }
});

export default router;
