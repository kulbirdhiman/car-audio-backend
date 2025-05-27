import express from "express";
// import * as dotenv from "dotenv-safe";
import dotenv from "dotenv"
import cors, { CorsOptions } from "cors";
dotenv.config();

import "./database";

const app = express();
// import syripeRoute from "./routes/stripePay"


const allowedDomain = process.env.ALLOWED_DOMAIL || ""; // Provide a default empty string

const corsOptions: CorsOptions = {
  origin: [allowedDomain,"https://www.kayhanaudio.com.au","http://localhost:3000","http://localhost:3001","https://car-audio-expert.onrender.com","http://89.116.134.75:3001","http://89.116.134.75:3000","https://caraudioexpert.com.au"],  // Allow all origins; replace with specific origins if needed
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials : true
};

app.use(cors(corsOptions));

// app.use("/v1/stripe_pay", syripeRoute);
app.use(express.json({ limit: '50mb' }));
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import departmentRoute from "./routes/department";
import categoryRoute from "./routes/category"
import carModelsRoute from "./routes/carModel"
import uploadRoutes from "./routes/upload"
import productRoute from "./routes/product"
import addOnRoute from "./routes/addOn"
import variationRoute from "./routes/variation"
import payPalRoute from "./routes/paypal"
import suareRoute from "./routes/square"
import checkOut from "./routes/checkOut"
import cartRoute from "./routes/carts"
import addressRoute from "./routes/billingAddress"
import ordersRoute from "./routes/order"
import couponRoute from "./routes/coupon"
import homeRoute from "./routes/home"
import canNotFindRoute from "./routes/canNotFind"
import siteMapRoute from "./routes/siteMap"
import wishListRoute from "./routes/wishList"
import seoMetaRoute from "./routes/seoMetaData"
// import afterPayRoute from "./routes/afterpay"
import adminDashboard from "./routes/adminDashboard"
import wpOrdersRoute from "./routes/wpOrders";
import redirectUrlRoute from "./routes/redirectUrl"
// import stripeOrder from "./routes/stripeOrder"
import zipPayRoute from "./routes/zipPay"
// import saleTargetRoute from "./routes/saleTarget"
// import achievedValueRoute from "./routes/achievedValue"


app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/department", departmentRoute);
app.use("/v1/category", categoryRoute);
app.use("/v1/car_model", carModelsRoute);
app.use("/v1/upload", uploadRoutes); 
app.use("/v1/product", productRoute); 
app.use("/v1/add_on", addOnRoute); 
app.use("/v1/variation", variationRoute); 
app.use("/v1/paypal", payPalRoute); 
app.use("/v1/square", suareRoute); 
app.use("/v1/checkout", checkOut); 
app.use("/v1/cart", cartRoute); 
app.use("/v1/address", addressRoute); 
app.use("/v1/order", ordersRoute); 
app.use("/v1/coupon", couponRoute); 
app.use("/v1/home", homeRoute); 
app.use("/v1/can_not_find", canNotFindRoute); 
app.use("/v1/site_map", siteMapRoute); 
app.use("/v1/wish_list", wishListRoute); 
app.use("/v1/seo_meta", seoMetaRoute); 
// app.use("/v1/after_pay", afterPayRoute); 
app.use("/v1/admin_dashboard", adminDashboard); 
app.use("/v1/wp_orders", wpOrdersRoute);
app.use("/v1/redirect_url", redirectUrlRoute);
// app.use("/v1/stripe_order", stripeOrder);
app.use("/v1/zip_pay", zipPayRoute);
// app.use("/v1/sale_target", saleTargetRoute);
// app.use("/v1/achived_value", achievedValueRoute);
 



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
