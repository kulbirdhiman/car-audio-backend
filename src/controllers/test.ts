import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws";
import { sendEmailWithoutTemplate, sendEmailWithTemplate } from "../helper/commonFunction";
import Order from "../models/Order";
import { calculatePrice } from "./checkOut";
import path from "path";
import fs from "fs";
import { PAYMENT_METHODS } from "../helper/constant";

// Function to Generate Invoice PDF
export const generateInvoice = async (data: any): Promise<string | undefined> => {
  try {
    // Load EJS template
 
          
   
    const templatePath = path.join(__dirname, "..", "..", "views", "invoice.ejs");
    const template = fs.readFileSync(templatePath, "utf8");

    // Prepare product data
    const productsData = data.products.map((r: any) => ({
      name: r.name,
      price: calculatePrice(r),
      quantity: r.quantity,
      variations: r.variations,
    }));
    const method = {
      [PAYMENT_METHODS.afterpay]: "After pay",
      [PAYMENT_METHODS.paypal]: "Paypal",
      [PAYMENT_METHODS.square_card]: "Square Card",
      [PAYMENT_METHODS.square_gpay]: "Google Pay",
      [PAYMENT_METHODS.stripe]: "Stripe Pay",
      [PAYMENT_METHODS.zip_pay]: "Zip Pay",
    };
    
    // Render HTML
    const html = ejs.render(template, {
      // logoUrl: "https://ik.imagekit.io/0ainyibtob/Forntendimages/logo.png?updatedAt=1702222811795",
      logoUrl:`${process.env.S3_BUCKET_URL}/logo/Kayhan audio logo.png`,
      user: data.user_detail,
      shipping: data.shipping_address,
      billing: data.billing_address,
      products: productsData,
      sub_total: data.payment_method != PAYMENT_METHODS.stripe ? data.sub_total / 1.1 : data.sub_total  ,
      gst: data.payment_method != PAYMENT_METHODS.stripe ? (data.sub_total / 110) * 10 :0 ,
      total_discount: data.total_discount,
      shipping_charge: data.shipping_charge,
      total_paid_value: data.total_paid_value,
      order_number:data.id,
      payment_method :method[data.payment_method],
      order_date:  new Date(data.created_at).toLocaleDateString("en-GB")
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new" as any,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF **as a buffer instead of a file**
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    // Upload PDF to S3
    const fileName = `invoices/invoice_${Date.now()}.pdf`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET!,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3.send(uploadCommand);

    // Construct S3 URL
    const fileUrl = `${process.env.S3_BUCKET_URL}/${fileName}`;

    // Update order with invoice URL
    await Order.update(
      { invoice: fileUrl },
      { where: { id: data.id } }
    );

    // Send email with the invoice
    const emailData = {
      customer_name: data.user_detail.name,
      order_number: data.id,
      // order_date: data.created_at.split("T")[0],
      order_date: new Date(data.created_at).toISOString().split("T")[0],
      products :productsData,
      pdf_url: fileUrl,
    };

  
    
    const sender = {email:"noreply@kayhanaudio.com.au",name :"Kayhan Audio"}
    await sendEmailWithTemplate(data.billing_address.email, data.billing_address.name, emailData, 2,sender);
    const subject = data.billing_address.name + " has placed order successully";

    
    const content = htmlContentReturn(emailData)
    await sendEmailWithoutTemplate("adamsure123@gmail.com", "Kayhan Audio", sender, subject,content)
    await sendEmailWithoutTemplate("info@caraudioexpert.com.au", "Kayhan Audio", sender, subject,content)
    

    console.log("Invoice generated and uploaded:", fileUrl);

    
    // await sendEmailWithTemplate("varinder12344@yopmail.com", "Kayhan Audio", emailData, 4,sender,subject); 
    return fileUrl;
  } catch (error) {
    console.error("Error generating invoice:", error);
  }
};


const htmlContentReturn = (emailData:any) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <table width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h2>New Order Placed</h2>
                <p>${emailData.customer_name} has successfully placed an order.</p>
            </td>
        </tr>

        <tr>
            <td style="text-align: center; padding: 20px;">
                <p><strong>Customer Name:</strong> ${emailData.customer_name}</p>
                <p><strong>Order Number:</strong> ${emailData.order_number}</p>
                <p><strong>Order Date:</strong> ${emailData.order_date}</p>
            </td>
        </tr>

        <!-- Products Section -->
        <tr>
            <td style="padding: 20px;">
                <h3 style="text-align: center;">Order Details</h3>
                <table width="100%" style="border-collapse: collapse;">
                    <tr>
                        <th style="border-bottom: 1px solid #ddd; padding: 10px; text-align: left;">Product</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 10px; text-align: left;">Quantity</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 10px; text-align: left;">Price</th>
                    </tr>
                    ${emailData.products
                      .map(
                        (product: any) => `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                            ${product.name}
                            ${
                              product.variations && product.variations.length > 0
                                ? `
                                <ul style="padding-left: 15px; margin: 5px 0;">
                                    ${product.variations
                                      .map(
                                        (variation: any) => `
                                    <li>
                                        <strong>${variation.name}:</strong> $${variation.price}
                                        ${
                                          variation.options &&
                                          variation.options.length > 0
                                            ? `
                                            <ul style="padding-left: 15px;">
                                                ${variation.options
                                                  .map(
                                                  (option: any)=> `
                                                <li>
                                                    <strong>${option.name}</strong> - $${option.price}
                                                </li>
                                                `
                                                  )
                                                  .join("")}
                                            </ul>
                                            `
                                            : ""
                                        }
                                    </li>
                                    `
                                      )
                                      .join("")}
                                </ul>
                                `
                                : ""
                            }
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product.quantity}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${product.price}</td>
                    </tr>
                    `
                      )
                      .join("")}
                </table>
            </td>
        </tr>

        <tr>
            <td style="text-align: center; font-size: 12px; color: #666; padding-top: 20px;">
                <p>Please process the order accordingly.</p>
                <p><a href="${emailData.pdf_url}" target="_blank">Download Invoice (PDF)</a></p>
                <p>&copy; 2025 Your Company Name. All rights reserved.</p>
            </td>
        </tr>
    </table>

</body>
</html>`;
};
