// test-emailjs.js - ES Modules version
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();

console.log("=== TESTING EMAILJS (Private Key) ===");

// Konfigurasi EmailJS
const SERVICE_ID = 'service_ymzax4w';
const TEMPLATE_ID = 'template_qicyv5b';
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

console.log("Service ID: " + SERVICE_ID);
console.log("Template ID: " + TEMPLATE_ID);
console.log("Public Key: " + (PUBLIC_KEY ? "✓ SET" : "❌ NOT SET"));
console.log("Private Key: " + (PRIVATE_KEY ? "✓ SET" : "❌ NOT SET"));

// Validasi konfigurasi
if (!PUBLIC_KEY || !PRIVATE_KEY) {
    console.log("❌ ERROR: Public Key dan Private Key harus diatur!");
    console.log("Silakan buat file .env dengan kredensial Anda");
    process.exit(1);
}

// Parameter template email
const templateParams = {
    from_name: "Test User",
    to_name: "Admin Hotel",
    email: "test@example.com",
    message: "Ini adalah pesan test dari aplikasi Node.js menggunakan EmailJS dengan Private Key",
    subject: "Test Email - Private Key"
};

// Fungsi untuk test koneksi EmailJS dengan private key
async function testEmailJS() {
    try {
        console.log("\n📧 Mengirim email test dengan Private Key...");
        
        const response = await emailjs.send(
            SERVICE_ID, 
            TEMPLATE_ID, 
            templateParams, 
            {
                publicKey: PUBLIC_KEY,
                privateKey: PRIVATE_KEY
            }
        );
        
        console.log('✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response text:', response.text);
        console.log('✅ Test berhasil: Email dapat dikirim dengan Private Key!');
        
        return true;
        
    } catch (error) {
        console.log('❌ Email service error:', error.text || error.message || 'Unknown error');
        console.log('❌ Test failed: Status ' + (error.status || 'Unknown'));
        console.log('Error details:', error);
        
        // Penjelasan error berdasarkan status code
        if (error.status === 403) {
            console.log('\n🔧 SOLUSI YANG DISARANKAN:');
            console.log('1. Pastikan Private Key sudah benar');
            console.log('2. Private Key berbeda dengan Public Key');
            console.log('3. Pastikan tidak ada karakter tambahan/spasi');
        } else if (error.status === 400) {
            console.log('\n🔧 SOLUSI YANG DISARANKAN:');
            console.log('1. Periksa Service ID dan Template ID');
            console.log('2. Pastikan template parameters sesuai');
        } else if (error.status === 401) {
            console.log('\n🔧 SOLUSI YANG DISARANKAN:');
            console.log('1. Kredensial tidak valid');
            console.log('2. Periksa kembali Public dan Private Key');
        }
        
        return false;
    }
}

// Jalankan test
testEmailJS();
