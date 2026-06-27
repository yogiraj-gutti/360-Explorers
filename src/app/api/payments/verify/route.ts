import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

// Validate Razorpay secret exists
if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Please define RAZORPAY_KEY_SECRET environment variable');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const booking = await prisma.booking.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { 
          status: 'processing', // Move to processing after payment
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id,
          paymentDate: new Date(),
          transactionId: razorpay_payment_id,
          invoiceNumber: `INV-${Date.now()}`
        }
      });

      return NextResponse.json({ 
        message: "Payment verified successfully", 
        bookingId: booking?.bookingId 
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
