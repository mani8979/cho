const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}, '_id name category');
    const categories = await Category.find({}, 'name');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Static Pages
    const today = new Date().toISOString().split('T')[0];
    
    // Home Page
    xml += '  <url>\n';
    xml += '    <loc>https://love-melt.vercel.app/</loc>\n';
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    // Shop Page
    xml += '  <url>\n';
    xml += '    <loc>https://love-melt.vercel.app/shop</loc>\n';
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';

    // 2. Category Filter Pages
    categories.forEach(cat => {
      xml += '  <url>\n';
      xml += `    <loc>https://love-melt.vercel.app/shop?category=${encodeURIComponent(cat.name)}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });

    // 3. Product Details Pages
    products.forEach(prod => {
      xml += '  <url>\n';
      xml += `    <loc>https://love-melt.vercel.app/product/${prod._id}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>\n';

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
