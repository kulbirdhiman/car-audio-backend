import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

export const bSUCCESS_RESPONSE = <T>(message: string, data: T) => {
  return {
    success: true,
    message,
    result: data,
  };
};

export const bVALIDATION_ERROR_RESPONSE = (
  message: string,
  errors: Record<string, any>
) => {
  return {
    success: false,
    message,
    errors,
  };
};

export const bSERVER_ERROR_RESPONSE = (errors?: any) => {
  return {
    success: false,
    message: "Something went wrong. Please try again after some time.",
    errors,
  };
};

export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s.-]/g, "") // Allow letters, numbers, spaces, dots, and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
};

export const recordCreatedMsg = (name: string) => {
  return name + " created successfully .";
};

export const recordUpdatedMsg = (name: string) => {
  return name + " updated successfully .";
};

export const recordDeletedMsg = (name: string) => {
  return name + " deleted successfully .";
};

export const generatePagination = (
  currentPage: number,
  resultForTotal: number,
  limit: number
): { showPagination: number[]; totalRecords: number } => {
  const totalRecords = resultForTotal;
  const totalPages = totalRecords !== 0 ? Math.ceil(totalRecords / limit) : 0;
  const showPagination: number[] = [];

  if (totalPages <= 10) {
    for (let i = 1; i <= totalPages; i++) {
      showPagination.push(i);
    }
  } else if (currentPage <= 5) {
    for (let i = 1; i <= 10; i++) {
      showPagination.push(i);
    }
  } else if (currentPage >= totalPages - 4) {
    for (let i = totalPages - 9; i <= totalPages; i++) {
      showPagination.push(i);
    }
  } else {
    for (let i = currentPage - 4; i <= currentPage + 5; i++) {
      showPagination.push(i);
    }
  }

  return { showPagination, totalRecords };
};

export const sendMailWithGmail = async (pdfUrl: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER as string,
    to: "customer112122112@yopmail.com",
    subject: "Your Invoice",
    text: "Please find the attached invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        path: pdfUrl,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendEmailWithTemplate = async (
  toEmail: any,
  toName: any,
  variables: any,
  templateId: any,
  from:any,
  subject?: string 
) => {
  console.log(variables);
  
  const apiKey = process.env.YOUR_BREVO_API_KEY;  
   

  const url = "https://api.brevo.com/v3/smtp/email";

  const emailData = {
    sender: { email: from.email, name: from.name }, // Set sender email and name

    to: [{ email: toEmail, name: toName }],
    templateId: templateId,
    params: variables, // Object containing template variables
  };
  if (subject) {
    (emailData as any).subject = subject;
  }

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


 

export const sendEmailWithoutTemplate = async (
  toEmail: string,
  toName: string,
  from: { email: string; name: string },
  subject: string,
  htmlContent: string
) => {
  const apiKey = process.env.YOUR_BREVO_API_KEY;  

  const url = "https://api.brevo.com/v3/smtp/email";

  const emailData = {
    sender: { email: from.email, name: from.name },
    to: [{ email: toEmail, name: toName }],
    subject: subject,
    htmlContent: htmlContent, // Directly passing HTML content
  };

  try {
    const response = await axios.post(url, emailData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
