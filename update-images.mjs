import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auqjlgsitfqrsnikmyhv.supabase.co';
const supabaseKey = 'sb_publishable_lG2uRbMuUtupBY1HLU9mLA_klxaIUHv';

const supabase = createClient(supabaseUrl, supabaseKey);

const categoryImages = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    'fashion-apparel': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    'home-kitchen': 'https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800&q=80',
    'books-media': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
    'sports-outdoors': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    'beauty-personal-care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'toys-games': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'
};

const defaultImage = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80';

async function main() {
    console.log('Fetching products...');
    const { data: products, error: fetchError } = await supabase.from('products').select('*, categories(slug)');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    console.log(`Found ${products.length} products. Updating images...`);

    let successCount = 0;

    for (const product of products) {
        const categorySlug = product.categories?.slug;
        const imageUrl = categoryImages[categorySlug] || defaultImage;

        const { error: updateError } = await supabase
            .from('products')
            .update({
                image_url: imageUrl,
                images: [imageUrl],
            })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Failed to update product ${product.id}:`, updateError);
        } else {
            successCount++;
        }
    }

    console.log(`Successfully updated ${successCount}/${products.length} products.`);
}

main();
