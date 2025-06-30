import Stripe from 'stripe'; // ใช้ import แทน require
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// สร้าง PaymentIntent
export const createPaymentIntent = async (req, res) => {
  const { amount } = req.body; // รับจำนวนเงินที่ต้องการชำระ

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // จำนวนเงินในเซ็นต์
      currency: 'thb', // ใช้สกุลเงินบาท
    });

    res.json({
      clientSecret: paymentIntent.client_secret, // ส่ง client_secret ไปให้ฝั่งไคลเอนต์
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};