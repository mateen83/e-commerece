import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auqjlgsitfqrsnikmyhv.supabase.co';
const supabaseKey = 'sb_publishable_lG2uRbMuUtupBY1HLU9mLA_klxaIUHv';

const supabase = createClient(supabaseUrl, supabaseKey);

const categoryImages = {
    'electronics': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'
    ],
    'fashion-apparel': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        'https://images.unsplash.com/photo-1434389678232-0408d6d8dbcc?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
    ],
    'home-kitchen': [
        'https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800&q=80',
        'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80',
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80'
    ],
    'sports-outdoors': [
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
    ],
    'books-media': [
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'
    ],
};

const defaultImages = [
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
];

async function main() {
    console.log('Fetching categories...');
    const { data: categories, error: fetchError } = await supabase.from('categories').select('*');

    if (fetchError || !categories || categories.length === 0) {
        console.error('Error fetching categories or no categories found:', fetchError);
        return;
    }

    console.log(`Found ${categories.length} categories. Starting seed...`);

    const productsToInsert = [];

    for (const category of categories) {
        const images = categoryImages[category.slug] || defaultImages;

        // Create 3 products per category
        for (let i = 1; i <= 3; i++) {
            const imageUrl = images[i % images.length];

            productsToInsert.push({
                name: `${category.name} Item ${i}`,
                slug: `${category.slug}-item-${i}`,
                description: `This is a high quality ${category.name} item. It features a modern design and premium materials. Perfect for everyday use or as a special gift.`,
                price: Math.floor(Math.random() * 90) + 10,
                category_id: category.id,
                sku: `SKU-${category.slug.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
                stock: Math.floor(Math.random() * 50) + 10,
                rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                rating_count: Math.floor(Math.random() * 100),
                image_url: imageUrl,
                images: [imageUrl, defaultImages[0]],
                variants: []
            });
        }
    }

    console.log(`Inserting ${productsToInsert.length} products...`);

    const { data, error } = await supabase
        .from('products')
        .insert(productsToInsert)
        .select();

    if (error) {
        console.error('Failed to insert products:', error);
    } else {
        console.log(`Successfully inserted ${data.length} products!`);
    }
}

main();
