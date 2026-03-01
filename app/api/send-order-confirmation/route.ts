import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// POST /api/send-order-confirmation
// Sends order confirmation emails to both user and admin.
// Uses Resend (https://resend.com) for reliable email delivery.
// Add RESEND_API_KEY to your .env.local file.
// ============================================================

const ADMIN_EMAIL = 'mateen8325@gmail.com';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface OrderEmailPayload {
    userEmail: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingInfo: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
}

// Build a styled HTML email body
function buildOrderEmailHTML(payload: OrderEmailPayload, isAdmin: boolean): string {
    const { orderNumber, items, subtotal, tax, shipping, total, shippingInfo, userEmail } = payload;

    const itemRows = items
        .map(
            (item) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;">PKR ${item.price.toLocaleString()}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
        )
        .join('');

    return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f7;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">PakMart</h1>
        <p style="color:#a0aec0;margin:8px 0 0;font-size:14px;">
          ${isAdmin ? 'New Order Received' : 'Order Confirmation'}
        </p>
      </div>

      <!-- Body -->
      <div style="padding:32px 24px;">
        <h2 style="color:#1a1a2e;margin:0 0 8px;">Order #${orderNumber}</h2>
        <p style="color:#718096;margin:0 0 24px;font-size:14px;">
          ${isAdmin ? `Customer: ${shippingInfo.fullName} (${userEmail})` : `Thank you for your order, ${shippingInfo.fullName}!`}
        </p>

        <!-- Order Items Table -->
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f7fafc;">
              <th style="padding:12px 8px;text-align:left;color:#4a5568;font-weight:600;">Item</th>
              <th style="padding:12px 8px;text-align:center;color:#4a5568;font-weight:600;">Qty</th>
              <th style="padding:12px 8px;text-align:right;color:#4a5568;font-weight:600;">Price</th>
              <th style="padding:12px 8px;text-align:right;color:#4a5568;font-weight:600;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="margin-top:24px;padding:16px;background:#f7fafc;border-radius:8px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:#4a5568;">
            <span>Subtotal</span><span>PKR ${subtotal.toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:#4a5568;">
            <span>Tax (17% GST)</span><span>PKR ${tax.toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px;color:#4a5568;">
            <span>Shipping</span><span>${shipping === 0 ? 'FREE' : `PKR ${shipping.toLocaleString()}`}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#1a1a2e;border-top:2px solid #e2e8f0;padding-top:12px;">
            <span>Total</span><span>PKR ${total.toLocaleString()}</span>
          </div>
        </div>

        <!-- Shipping Info -->
        <div style="margin-top:24px;">
          <h3 style="color:#1a1a2e;margin:0 0 12px;font-size:16px;">Shipping Address</h3>
          <p style="color:#4a5568;margin:0;font-size:14px;line-height:1.6;">
            ${shippingInfo.fullName}<br/>
            ${shippingInfo.address}<br/>
            ${shippingInfo.city}, ${shippingInfo.postalCode}<br/>
            Phone: ${shippingInfo.phone}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f7fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="color:#a0aec0;margin:0;font-size:12px;">
          ${isAdmin ? 'This is an admin notification from PakMart.' : 'If you have any questions, reply to this email or contact our support team.'}
        </p>
      </div>
    </div>
  </body>
  </html>`;
}

export async function POST(request: NextRequest) {
    try {
        const payload: OrderEmailPayload = await request.json();

        // Validate required fields
        if (!payload.userEmail || !payload.orderNumber || !payload.items?.length) {
            return NextResponse.json(
                { error: 'Missing required fields: userEmail, orderNumber, items' },
                { status: 400 }
            );
        }

        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error('RESEND_API_KEY is not configured in .env.local');
            // Don't block checkout — just log the error and return success
            return NextResponse.json({
                success: true,
                warning: 'Email not sent — RESEND_API_KEY not configured. Order was still created.',
            });
        }

        // Send email to user
        const userEmailResult = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
                from: 'PakMart <onboarding@resend.dev>',
                to: [payload.userEmail],
                subject: `Order Confirmation #${payload.orderNumber}`,
                html: buildOrderEmailHTML(payload, false),
            }),
        });

        if (!userEmailResult.ok) {
            const errBody = await userEmailResult.text();
            console.error('Failed to send user email:', errBody);
        }

        // Send email to admin
        const adminEmailResult = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
                from: 'PakMart <onboarding@resend.dev>',
                to: [ADMIN_EMAIL],
                subject: `New Order Received - #${payload.orderNumber}`,
                html: buildOrderEmailHTML(payload, true),
            }),
        });

        if (!adminEmailResult.ok) {
            const errBody = await adminEmailResult.text();
            console.error('Failed to send admin email:', errBody);
        }

        return NextResponse.json({ success: true, message: 'Order confirmation emails sent.' });
    } catch (error: any) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send order confirmation emails.' },
            { status: 500 }
        );
    }
}
