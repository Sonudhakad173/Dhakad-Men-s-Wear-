const router = require("express").Router();
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

router.post("/create-order", async (req,res)=>{
  const options = {
    amount: req.body.amount * 100,
    currency: "INR"
  };
  const order = await razorpay.orders.create(options);
  res.json(order);
});

router.post("/verify", async (req,res)=>{
  const {userId,products,totalAmount,paymentId,email} = req.body;

  const order = await Order.create({userId,products,totalAmount,paymentId});

  // Generate Invoice
  const doc = new PDFDocument();
  doc.pipe(require("fs").createWriteStream(`invoice-${order._id}.pdf`));
  doc.text("VIREXO - Premium Invoice");
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Amount: ₹${totalAmount}`);
  doc.end();

  // Email
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{user:process.env.EMAIL,pass:process.env.EMAIL_PASS}
  });

  transporter.sendMail({
    from:"VIREXO",
    to:email,
    subject:"Order Confirmed",
    text:"Your order has been placed successfully."
  });

  res.json({message:"Payment verified & Order saved"});
});

module.exports = router;