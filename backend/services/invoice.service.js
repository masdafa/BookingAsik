import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoicePDF = async (booking) => {
  const filename = `invoice-${booking.id}.pdf`;
  const filePath = path.join(process.cwd(), 'invoices', filename);
  if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.text(`Booking ID: ${booking.id}`);
  doc.text(`Hotel ID: ${booking.hotel_id}`);
  doc.text(`Date: ${booking.start_date} - ${booking.end_date}`);
  doc.text(`Total: ${booking.total_price}`);
  doc.end();
  return filePath;
};
