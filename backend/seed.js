require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const InstagramPhoto = require('./models/InstagramPhoto');

const seedCategories = [
  { name: 'Truffles & Bonbons', displayOrder: 1, minOrder: 0, maxOrder: 0, image: 'https://images.unsplash.com/photo-1548907040-4d42b52125bf?auto=format&fit=crop&w=600&q=80' },
  { name: 'Artisan Chocolate Bars', displayOrder: 2, minOrder: 0, maxOrder: 0, image: 'https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&w=600&q=80' },
  { name: 'Luxury Gift Boxes', displayOrder: 3, minOrder: 0, maxOrder: 0, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80' }
];

const seedProducts = [
  {
    name: 'Signature Dark Truffles Box',
    price: 799.00,
    mrp: 999.00,
    image: 'https://images.unsplash.com/photo-1548907040-4d42b52125bf?auto=format&fit=crop&w=600&q=80',
    description: 'Handcrafted 70% dark chocolate truffles with a silky smooth Belgian ganache center. Dusted with premium cocoa powder.',
    category: 'Truffles & Bonbons',
    weight: '200g',
    length: 12.00,
    breadth: 12.00,
    height: 4.00,
    stockQuantity: 50,
    adminRating: 5.0,
    meeshoLink: ''
  },
  {
    name: 'Roasted Hazelnut Milk Chocolate Bar',
    price: 249.00,
    mrp: 299.00,
    image: 'https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&w=600&q=80',
    description: 'Rich, smooth and creamy milk chocolate bar loaded with slow-roasted premium organic hazelnuts. Perfectly balanced sweetness.',
    category: 'Artisan Chocolate Bars',
    weight: '100g',
    length: 15.00,
    breadth: 8.00,
    height: 1.00,
    stockQuantity: 100,
    adminRating: 4.8,
    meeshoLink: ''
  },
  {
    name: 'Rose & Pistachio White Chocolate',
    price: 279.00,
    mrp: 329.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    description: 'Velvety premium white chocolate bar infused with handpicked organic rose petals and crunchy salted pistachios.',
    category: 'Artisan Chocolate Bars',
    weight: '100g',
    length: 15.00,
    breadth: 8.00,
    height: 1.00,
    stockQuantity: 30,
    adminRating: 4.9,
    meeshoLink: ''
  },
  {
    name: 'Love Melt Luxury Gift Box',
    price: 1499.00,
    mrp: 1799.00,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
    description: 'The ultimate chocolate assortment featuring our signature dark truffles, hazelnut milk chocolate blocks, and rose-infused bonbons. Packaged in a beautiful gold-embossed gift box.',
    category: 'Luxury Gift Boxes',
    weight: '500g',
    length: 25.00,
    breadth: 20.00,
    height: 6.00,
    stockQuantity: 20,
    adminRating: 5.0,
    meeshoLink: ''
  }
];

const seedInstagramPhotos = [
  {
    imagePath: 'https://images.unsplash.com/photo-1544908703-97914799dbac?auto=format&fit=crop&w=500&q=80',
    link: 'https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2'
  },
  {
    imagePath: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b057?auto=format&fit=crop&w=500&q=80',
    link: 'https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2'
  },
  {
    imagePath: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=500&q=80',
    link: 'https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2'
  },
  {
    imagePath: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=500&q=80',
    link: 'https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2'
  }
];

async function runSeed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected.');

    // Clear existing data
    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Clearing existing Instagram photos...');
    await InstagramPhoto.deleteMany({});

    // Seed data
    console.log('Seeding categories...');
    await Category.insertMany(seedCategories);
    
    console.log('Seeding products...');
    await Product.insertMany(seedProducts);

    console.log('Seeding Instagram photos...');
    await InstagramPhoto.insertMany(seedInstagramPhotos);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
