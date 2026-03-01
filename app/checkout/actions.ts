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

        return { success: true, orderId: order.id, orderNumber: order.order_number };
    } catch (error: any) {
        console.error('Checkout error:', error);
        return { success: false, error: error.message || 'An error occurred during checkout.' };
    }
}
