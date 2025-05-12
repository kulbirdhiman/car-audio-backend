import Stripe from "stripe";
const stripe = new Stripe((process.env as any).STRIPE_SECRET_KEY);
import { Request, Response } from "express";
import { confirmPayment, placeOrder } from "./checkOut";
import User from "../models/User";
import Order from "../models/Order";
 
export const createSession = async (req: Request, res: Response) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      productData,
      paymentMethod,
      user,
      discount,
      selectedShipping,
      deviceDetails,
    } = req.body;

    const { order } = await placeOrder(
      shippingAddress,
      user,
      billingAddress,
      productData,
      paymentMethod,
      discount,
      selectedShipping,
      deviceDetails
    );

    const amount = order.total_paid_value.toString();
    let consumer;

    if (user) {
      const useDetail = await User.findOne({
        where: { id: user.id },
      });
      consumer = {
        givenNames: (useDetail as any).name,
        surname: (useDetail as any).last_name,
        email: (useDetail as any).email,
        countryCode: (useDetail as any).country.iso2,
        phoneNumber: (useDetail as any).phone,
      };
    } else {
      consumer = {
        givenNames: billingAddress.name,
        surname: billingAddress.last_name,
        email: billingAddress.email,
        countryCode: billingAddress.country.iso2,
        phoneNumber: billingAddress.phone,
      };
    }

    const sampleCartItems = [
      {
        itemId: "1",
        itemName: "Leather Bag",
        quantity: 1,
        price: 50.0, // in USD
        currency: "USD",
        description: "A stylish leather bag",
        image: "https://example.com/images/leather-bag.jpg",
      },
    ];

    //   const customer = await stripe.customers.create({
    //     metadata: {
    //       cartItems: JSON.stringify(sampleCartItems), // Storing cart in metadata
    //     }
    //   });
    const line_items = [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: "Total Payment",
          },
          unit_amount: order.total_paid_value * 100, // amount in cents ($50)
        },
        quantity: 1,
      },
    ];

    const orderDetail = {id:order.id}
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email :consumer.email , 
      // customer: customer.id,
      // success_url: `${process.env.WEB_URL}/payment-successfull?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.WEB_URL}/payment-successfull/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        order:JSON.stringify(orderDetail),
        orderId: order.id, // send order ID to retrieve later
        userId: user?.id || null,
      },
    });

    res.json({ redirectUrl: session.url }); // Afterpay payment page URL
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response): Promise<void>  => {
  const webhookSecret = (process.env as any).STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const signature = req.headers["stripe-signature"] as any;

    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed: ${err}`);
     res.sendStatus(400);
     return
  }

  const data = event.data.object;
  const eventType = event.type;
  console.log("eventType", eventType);

  if (eventType === "checkout.session.completed") {
    const session = data as Stripe.Checkout.Session;

    const order = session.metadata?.order;
    const userId = session.metadata?.userId;
    const orderId = session.metadata?.orderId;
    const paymentIntentId = session.payment_intent as string; // ✅ Stripe Payment Intent ID
    const paymentDetail = { paymentIntentId };
    if(order){
      const orderDetail = await Order.findOne({where :{id:orderId}})
      await confirmPayment(paymentDetail,orderDetail );

    }

    //   stripe.customers.retrieve(data.customer)
    //     .then(async (customer) => {
    //       try {
    //         await createOrder(customer, data);
    //       } catch (err) {
    //         console.error("Error creating order:", err);
    //       }
    //     })
    //     .catch(err => console.error("Error retrieving customer:", err));
  }

  res.status(200).end();
};
