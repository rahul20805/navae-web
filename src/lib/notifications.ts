export async function sendOrderConfirmation(email: string, orderId: string, amount: number) {
  console.log(`[MOCK EMAIL SENT] To: ${email}`);
  console.log(`Subject: Order Confirmation - ${orderId}`);
  console.log(`Body: Thank you for your order! Your total was ₹${amount}.`);
  // Future implementation: Use Resend or SendGrid here
  return { success: true };
}

export async function sendBookingConfirmation(email: string, className: string, date: Date) {
  console.log(`[MOCK EMAIL SENT] To: ${email}`);
  console.log(`Subject: Class Booking Confirmation - ${className}`);
  console.log(`Body: We have received your booking request for ${className} on ${date.toLocaleDateString()}.`);
  // Future implementation: Use Resend or SendGrid here
  return { success: true };
}
