import { Resend } from 'resend';
import type { Order } from '@/types';
import { formatPriceFromDecimal } from './utils';

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY is not set; emails will not be sent.');
    return null;
  }
  _resend = new Resend(key);
  return _resend;
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    process.env.NEXT_PUBLIC_STORE_NAME
      ? `${process.env.NEXT_PUBLIC_STORE_NAME} <onboarding@resend.dev>`
      : 'Mainline Hub <onboarding@resend.dev>'
  );
}

function storeName(): string {
  return process.env.NEXT_PUBLIC_STORE_NAME || 'Mainline Hub';
}

export async function sendOrderConfirmationEmail(order: Order) {
  const resend = getResend();
  if (!resend || !order.customer_email) return;

  const itemsList = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0">${escapeHtml(i.name)}${
          i.variant ? ` (${escapeHtml(i.variant)})` : ''
        } &times; ${i.quantity}</td><td style="padding:8px 0;text-align:right;font-family:monospace">${formatPriceFromDecimal(
          i.price * i.quantity
        )}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#0a0a0a;color:#e5e5e5;padding:32px;max-width:600px;margin:0 auto">
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.2em;color:#ff9c00;text-transform:uppercase;margin-bottom:8px">Order Confirmed</div>
      <h1 style="font-weight:300;font-size:24px;margin:0 0 16px">Thanks for your order, ${escapeHtml(order.customer_name || 'friend')}.</h1>
      <p style="color:#999;margin:0 0 24px">Order <strong style="color:#fff">#${order.order_number}</strong> &mdash; we'll email tracking once it ships.</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #2a2a2a;border-bottom:1px solid #2a2a2a">${itemsList}</table>
      <table style="width:100%;margin-top:16px;font-size:14px">
        <tr><td style="color:#999">Subtotal</td><td style="text-align:right;font-family:monospace">${formatPriceFromDecimal(order.subtotal || 0)}</td></tr>
        <tr><td style="color:#999">Shipping</td><td style="text-align:right;font-family:monospace">${formatPriceFromDecimal(order.shipping_cost || 0)}</td></tr>
        <tr><td style="font-weight:600;padding-top:8px;border-top:1px solid #2a2a2a">Total</td><td style="text-align:right;font-family:monospace;padding-top:8px;border-top:1px solid #2a2a2a">${formatPriceFromDecimal(order.total)}</td></tr>
      </table>
      <p style="margin-top:32px;color:#666;font-size:12px">Questions? Just reply to this email.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromAddress(),
      to: order.customer_email,
      subject: `Order #${order.order_number} confirmed - ${storeName()}`,
      html,
    });
  } catch (err) {
    console.error('[email] order confirmation send failed', err);
  }
}

export async function sendOrderShippedEmail(
  order: Order,
  trackingNumber: string | null,
  trackingUrl: string | null
) {
  const resend = getResend();
  if (!resend || !order.customer_email) return;

  const trackingBlock = trackingUrl
    ? `<a href="${escapeAttr(trackingUrl)}" style="display:inline-block;background:#ff9c00;color:#0a0a0a;padding:12px 24px;border-radius:4px;text-decoration:none;font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;margin-top:16px">Track Package</a>`
    : trackingNumber
    ? `<div style="font-family:monospace;font-size:14px">Tracking: ${escapeHtml(trackingNumber)}</div>`
    : '';

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#0a0a0a;color:#e5e5e5;padding:32px;max-width:600px;margin:0 auto">
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.2em;color:#ff9c00;text-transform:uppercase;margin-bottom:8px">Shipped</div>
      <h1 style="font-weight:300;font-size:24px;margin:0 0 16px">Your order is on the way.</h1>
      <p style="color:#999;margin:0 0 8px">Order <strong style="color:#fff">#${order.order_number}</strong> shipped today.</p>
      ${trackingBlock}
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromAddress(),
      to: order.customer_email,
      subject: `Order #${order.order_number} shipped - ${storeName()}`,
      html,
    });
  } catch (err) {
    console.error('[email] order shipped send failed', err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
