'use server';

import { createClient } from '@/lib/supabase/server';
import { createOrder, addOrderItems } from '@/lib/services/orders';
import { addShippingAddress } from '@/lib/services/users';

export async function processCheckout(formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethodCode: string;
    items: Array<{
        product_id: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
}) {
    const supabase = await createClient();

    // 1. Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    try {
        // 2. Fetch payment method ID
        const { data: currentPaymentMethod, error: pmError } = await supabase
            .from('payment_methods')
            .select('id')
            .eq('code', formData.paymentMethodCode)
            .single();

        if (pmError || !currentPaymentMethod) {
            throw new Error('Invalid payment method selected.');
        }

        // 3. Create or save shipping address if user is logged in
        let shippingAddressId = null;

        if (userId) {
            const address = await addShippingAddress(userId, {
                full_name: formData.fullName,
                phone_number: formData.phone,
                street_address: formData.address,
                city: formData.city,
                postal_code: formData.postalCode,
                region: '',
                is_default: true,
            });
            shippingAddressId = address.id;
        } else {
            // For guests, we would ideally store the address in the order itself
            // or create a guest shipping address record. For now, since the DB
            // schema references `shipping_addresses` and requires `user_id`,
            // we'll leave it null for guests.
            shippingAddressId = null;
        }

        // 4. Create the main Order record
        const order = await createOrder(
            userId,
            !userId ? formData.email : null, // guest_email
            formData.subtotal,
            formData.tax,
            formData.shipping,
            shippingAddressId as any, // Type cast for now 
            currentPaymentMethod.id
        );

        // 5. Add order items
        await addOrderItems(order.id, formData.items);

        // 6. Clear the cart if user is logged in
        if (userId) {
            await supabase
                .from('cart')
                .delete()
                .eq('user_id', userId);
        }

        // 7. Fetch product names for the email
        const productIds = formData.items.map(i => i.product_id);
        const { data: products } = await supabase
            .from('products')
            .select('id, name')
            .in('id', productIds);

        const productMap = new Map(products?.map(p => [p.id, p.name]) || []);

        // 8. Send order confirmation emails (fire-and-forget, don't block checkout)
        try {
            const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            await fetch(`${origin}/api/send-order-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: formData.email,
                    orderNumber: order.order_number,
                    items: formData.items.map(item => ({
                        name: productMap.get(item.product_id) || `Product ${item.product_id}`,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    subtotal: formData.subtotal,
                    tax: formData.tax,
                    shipping: formData.shipping,
                    total: formData.subtotal + formData.tax + formData.shipping,
                    shippingInfo: {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        phone: formData.phone,
                    },
                }),
            });
        } catch (emailError) {
            console.error('Failed to send order emails (non-blocking):', emailError);
        }

        return { success: true, orderId: order.id, orderNumber: order.order_number };
    } catch (error: any) {
        console.error('Checkout error:', error);
        return { success: false, error: error.message || 'An error occurred during checkout.' };
    }
}
