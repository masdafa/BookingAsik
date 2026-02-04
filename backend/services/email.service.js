// services/email.service.js
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();

export const sendBookingEmail = async (to, booking) => {
  try {
    console.log('📧 EmailJS Service - Starting email send process');
    console.log('📧 EmailJS Service - To:', to);
    console.log('📧 EmailJS Service - Booking data:', JSON.stringify(booking, null, 2));

    // Validasi environment variables
    const requiredEnvVars = [
      'EMAILJS_SERVICE_ID',
      'EMAILJS_TEMPLATE_ID', 
      'EMAILJS_PUBLIC_KEY',
      'EMAILJS_PRIVATE_KEY'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      const errorMsg = `Missing environment variables: ${missingEnvVars.join(', ')}`;
      console.error('❌ EmailJS Service - Configuration Error:', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('📧 EmailJS Service - Configuration OK');

    // Validasi input
    if (!to || !booking) {
      console.error('❌ EmailJS Service - Missing required data:', { to, hasBooking: !!booking });
      throw new Error('Email address and booking data are required');
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error('❌ EmailJS Service - Invalid email format:', to);
      throw new Error('Invalid email format');
    }

    console.log('✅ EmailJS Service - Email validation passed');

    // Template parameters untuk EmailJS - Coba semua kemungkinan field
    const templateParams = {
      // Field utama untuk penerima email (coba semua variasi)
      to_email: to,
      user_email: to,
      reply_to: to,
      email: to,
      customer_email: to,
      
      // Informasi penerima
      customer_name: booking.customer_name || booking.customerName || 'Valued Guest',
      
      // Informasi booking
      booking_id: booking.id || booking.bookingId || 'N/A',
      hotel_name: booking.hotel_name || booking.hotelName || 'Hotel XYZ',
      check_in: formatDate(booking.check_in || booking.checkIn),
      check_out: formatDate(booking.check_out || booking.checkOut),
      rooms: booking.rooms || booking.roomType || 'N/A',
      guests: booking.guests || booking.numberOfGuests || 'N/A',
      payment_method: booking.payment_method || booking.paymentMethod || 'N/A',
      total: formatCurrency(booking.total || booking.totalAmount),
      booking_date: formatDate(booking.booking_date || booking.bookingDate || new Date()),
      
      // Subject email
      subject: `Booking Confirmation #${booking.id || booking.bookingId || 'N/A'}`
    };

    console.log('📧 EmailJS Service - Template params:', JSON.stringify(templateParams, null, 2));

    // Kirim email menggunakan EmailJS
    console.log('📧 EmailJS Service - Sending email via EmailJS...');
    
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );

    console.log('✅ EmailJS Service - Email sent successfully!');
    console.log('✅ EmailJS Service - Response:', {
      status: response.status,
      text: response.text
    });
    
    return {
      success: true,
      status: response.status,
      message: 'Booking confirmation email sent successfully',
      email: to,
      response: response.text
    };

  } catch (error) {
    console.error('❌ EmailJS Service - Error sending booking email:', error);
    console.error('❌ EmailJS Service - Error details:', {
      status: error.status,
      text: error.text,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Gunakan error.text jika tersedia, fallback ke message
    const errorMessage = error.text || error.message || 'Unknown email service error';
    throw new Error(`Email service error: ${errorMessage}`);
  }
};

// Helper functions
const formatDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return date.toString();
    }
    
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    return dateObj.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('❌ Error formatting date:', error);
    return 'N/A';
  }
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  
  try {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  } catch (error) {
    console.error('❌ Error formatting currency:', error);
    return `Rp ${amount}`;
  }
};

export default {
  sendBookingEmail
};
