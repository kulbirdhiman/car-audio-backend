import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const generateOrderPDF = async (req: Request, res: Response) => {
    const order = {
        "user_detail": {
            "country": {
                "id": 14,
                "name": "Australia",
                "iso3": "AUS",
                "iso2": "AU"
            },
            "status": 1,
            "created_at": "2025-03-15T05:22:02.705Z",
            "updated_at": "2025-03-15T05:22:02.705Z",
            "id": 23,
            "email": "karan@yopmail.com",
            "phone": "87272978",
            "name": "test",
            "last_name": "test",
            "role": 2,
            "password": "$2b$10$6bRrBbvv7/KnfPJfbAqZjuIxAQEBeFkEv/x8q.tfW3GvCVy5727Ye",
            "updatedAt": "2025-03-15T05:22:02.706Z",
            "createdAt": "2025-03-15T05:22:02.706Z"
        },
        "shipping_address": {
            "name": "test",
            "last_name": "test",
            "email": "karan@yopmail.com",
            "phone": "87272978",
            "country": {
                "id": 14,
                "name": "Australia",
                "iso3": "AUS",
                "iso2": "AU"
            },
            "country_name": "Australia",
            "state": {
                "id": 3910,
                "name": "Northern Territory",
                "state_code": "NT"
            },
            "state_name": "Northern Territory",
            "city": "89389",
            "street_address": "jkwkj",
            "postcode": "89189"
        },
        "billing_address": {
            "name": "test",
            "last_name": "test",
            "email": "karan@yopmail.com",
            "phone": "87272978",
            "country": {
                "id": 14,
                "name": "Australia",
                "iso3": "AUS",
                "iso2": "AU"
            },
            "country_name": "Australia",
            "state": {
                "id": 3910,
                "name": "Northern Territory",
                "state_code": "NT"
            },
            "state_name": "Northern Territory",
            "city": "89389",
            "street_address": "jkwkj",
            "postcode": "89189"
        },
        "payment_detail": {
            "paymentId": "tsxnQfqe1CHXszMm8jDGkenu4A9YY"
        },
        "products": [
            {
                "cart_id": 1742015999608,
                "images": [
                    {
                        "image": "uploads/1741337299707_1.jpg"
                    },
                    {
                        "image": "uploads/1741337303568_2.jpg"
                    }
                ],
                "quantity": 1,
                "name": "0 Gauge Ring Terminals – 1 Black 1 Red",
                "slug": "0-gauge-ring-terminals-1-black-1-red",
                "weight": null,
                "variations": [],
                "product_id": 707,
                "regular_price": 7.5,
                "discount_price": 0,
                "price": 7.5,
                "department_id": 17,
                "category_id": 70,
                "model_id": null
            },
            {
                "cart_id": 1742016166868,
                "images": [
                    {
                        "image": "uploads/1741177965188_2.jpg"
                    },
                    {
                        "image": "uploads/1741177967912_1.jpg"
                    },
                    {
                        "image": "uploads/1741177970157_3.jpg"
                    },
                    {
                        "image": "uploads/1741177972597_4.jpg"
                    },
                    {
                        "image": "uploads/1741177974762_5.jpg"
                    },
                    {
                        "image": "uploads/1741177978052_6.jpg"
                    },
                    {
                        "image": "uploads/1741177980403_7.jpg"
                    },
                    {
                        "image": "uploads/1741177983642_8.jpg"
                    },
                    {
                        "image": "uploads/1741177985927_9.jpg"
                    },
                    {
                        "image": "uploads/1741177988123_10.jpg"
                    },
                    {
                        "image": "uploads/1741177990282_11.jpg"
                    }
                ],
                "quantity": 1,
                "name": " SatNav for Lexus IS200, 1999-2005 | V6 | 9 Inch",
                "slug": "satnav-for-lexus-is200-1999-2005-v6-9-inch",
                "weight": 4,
                "variations": [
                    {
                        "department_ids": [
                            12,
                            13
                        ],
                        "category_ids": [],
                        "product_ids": [],
                        "options": [
                            {
                                "id": 1741444411534,
                                "in_stock": 1,
                                "name": "Premium Sound Kit",
                                "price": 75
                            }
                        ],
                        "id": 9,
                        "name": "Select Premium Sound Kit to Activate Factory Amp or Sub",
                        "is_required": 0,
                        "is_multy": 1,
                        "is_quantity_based": 1,
                        "status": 1,
                        "created_by": 1,
                        "edit_by": 1,
                        "created_at": "2025-03-08T14:36:32.000Z",
                        "updated_at": "2025-03-10T11:18:15.000Z",
                        "deleted_at": null,
                        "createdAt": "2025-03-08T14:36:32.000Z",
                        "updatedAt": "2025-03-10T11:18:15.000Z",
                        "deletedAt": null
                    }
                ],
                "product_id": 352,
                "regular_price": 1395,
                "discount_price": 0,
                "price": 1395,
                "department_id": 12,
                "category_id": 37,
                "model_id": 544
            }
        ],
        "id": 23,
        "user_id": 23,
        "shipping_charge": 31,
        "sub_total": 1478,
        "total_discount": 0,
        "gift_card_discount": 0,
        "coupon_code_discount": 0,
        "total_paid_value": 1509,
        "payment_status": 1,
        "status": 1,
        "payment_method": 1,
        "shippment_method": null,
        "shippment_type": null,
        "selected_shipment": 1,
        "tracking_number": null,
        "labe_url": null,
        "edit_by": null,
        "shipped_at": null,
        "delivered_at": null,
        "created_at": "2025-03-15T05:22:02.000Z",
        "updated_at": "2025-03-15T05:22:04.000Z",
        "deleted_at": null,
        "createdAt": "2025-03-15T05:22:02.000Z",
        "updatedAt": "2025-03-15T05:22:04.000Z",
        "deletedAt": null
    }
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Disposition', 'inline; filename="order_invoice.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Header Section
    const logoUrl = 'https://ik.imagekit.io/0ainyibtob/Forntendimages/logo.png?updatedAt=1702222811795';
    const tempImagePath = path.join(__dirname, 'temp_logo.png');

    try {
        const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(tempImagePath, response.data);
        doc.image(tempImagePath, 50, 30, { width: 100 });
        fs.unlinkSync(tempImagePath);
    } catch (error) {
        console.error('Failed to download logo:', error);
    }
    
    doc.fontSize(20).font('Helvetica-Bold').text('Order Invoice', { align: 'right' });
    doc.moveDown(2);

    // Billing and Shipping Address Side by Side
    const leftX = 50;
    const rightX = 300;

    doc.fontSize(12).font('Helvetica-Bold').text('Billing Address:', leftX, doc.y);
    doc.font('Helvetica').text(`${order.billing_address.name} ${order.billing_address.last_name}`, leftX, doc.y);
    doc.text(order.billing_address.street_address, leftX);
    doc.text(`${order.billing_address.city}, ${order.billing_address.state_name}, ${order.billing_address.country_name}, ${order.billing_address.postcode}`, leftX);
    doc.text(`Phone: ${order.billing_address.phone}`, leftX);
    
    doc.fontSize(12).font('Helvetica-Bold').text('Shipping Address:', rightX, doc.y - 70);
    doc.font('Helvetica').text(`${order.shipping_address.name} ${order.shipping_address.last_name}`, rightX, doc.y);
    doc.text(order.shipping_address.street_address, rightX);
    doc.text(`${order.shipping_address.city}, ${order.shipping_address.state_name}, ${order.shipping_address.country_name}, ${order.shipping_address.postcode}`, rightX);
    doc.text(`Phone: ${order.shipping_address.phone}`, rightX);
    
    doc.moveDown(2);
    
    // Invoice Details
    doc.fontSize(12).font('Helvetica-Bold').text('Invoice Date:', leftX, doc.y, { continued: true }).font('Helvetica').text(` ${new Date(order.created_at).toLocaleDateString()}`);
    // doc.fontSize(12).font('Helvetica-Bold').text('Due Date:', rightX, doc.y, { continued: true }).font('Helvetica').text(` ${new Date(order.created_at).toLocaleDateString()}`);
    doc.moveDown();

   // Table Header
   const startX = 50;
   let startY = doc.y;

   doc
       .font('Helvetica-Bold')
       .fontSize(12)
       .text('Item', startX+50, startY)
       .text('Quantity', startX + 220, startY)
       .text('Price', startX + 310, startY)
       .text('Total', startX + 410, startY);
   
   doc.moveDown();
    // Order Items
 // Order Items
const rowX = 50;
const colWidths = [220, 50, 100, 100]; // Column widths for item, qty, price, total
let yPosition = doc.y;

order.products.forEach((item) => {
    // Calculate text height for the product name (this determines row height)
    const itemHeight = doc.heightOfString(item.name, { width: colWidths[0], align: 'left' });
    const rowHeight = Math.max(20, itemHeight + 10); // Ensure minimum row height of 20px

    // Draw border
    doc.rect(rowX, yPosition, 500, rowHeight).stroke();

    // Draw text inside the row
    doc.text(item.name, rowX + 10, yPosition + 5, { width: colWidths[0] }); // Item name
    doc.text(item.quantity.toString(), rowX + colWidths[0] + 10, yPosition + 5, { width: colWidths[1], align: 'center' }); // Quantity
    doc.text(`$${item.price}`, rowX + colWidths[0] + colWidths[1] + 10, yPosition + 5, { width: colWidths[2], align: 'center' }); // Price
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, rowX + colWidths[0] + colWidths[1] + colWidths[2] + 10, yPosition + 5, { width: colWidths[3], align: 'center' }); // Total price

    // Move to next row dynamically
    yPosition += rowHeight;
});

    
 // Summary Section
// Move down for spacing
doc.moveDown(2);

// Draw a separator line
doc.moveTo(400, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(1);

// Define font style and size
doc.fontSize(12).font('Helvetica');

// Display order summary details with proper alignment
doc.text(`Subtotal: `, { continued: true })
   .font('Helvetica-Bold')
   .text(`$${order.sub_total}`, { align: 'right' })
   .font('Helvetica');

doc.text(`Shipping Charge: `, { continued: true })
   .font('Helvetica-Bold')
   .text(`$${order.shipping_charge}`, { align: 'right' })
   .font('Helvetica');

doc.text(`Total Discount: `, { continued: true })
   .font('Helvetica-Bold')
   .text(`$${order.total_discount}`, { align: 'right' })
   .font('Helvetica');

// Draw another separator before Total Paid
doc.moveDown(1);
doc.moveTo(400, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(1);

// Display Total Paid in bold
doc.fontSize(12)
   .font('Helvetica-Bold')
   .text(`Total Paid: $${order.total_paid_value}`, { align: 'right' });

doc.moveDown(2);



    // Footer Section
    doc.fontSize(10).font('Helvetica').text('Thank you for your business!', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text('Powered by YourCompanyName', { align: 'center' });
    
    doc.end();
};
