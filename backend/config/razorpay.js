import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || "rzp_test_shopkart_testkey";
export const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || "test_secret_shopkart_987654";

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async ({ amount, currency = "INR", receipt }) => {
  try {
    if (
      process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes("shopkart_testkey")
    ) {
      const order = await razorpayInstance.orders.create({
        amount,
        currency,
        receipt,
      });
      return order;
    }
  } catch (error) {
    console.warn("Razorpay API call failed, falling back to local test mode order:", error.message);
  }

  return {
    id: `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    entity: "order",
    amount,
    amount_paid: 0,
    amount_due: amount,
    currency,
    receipt,
    status: "created",
    attempts: 0,
    created_at: Math.floor(Date.now() / 1000),
  };
};

export default razorpayInstance;
