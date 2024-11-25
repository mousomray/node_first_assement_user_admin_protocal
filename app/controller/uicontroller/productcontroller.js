const Product = require('../../model/product');
const path = require('path')
const fs = require('fs')

class productuicontroller {

    // Handle POST product
    async addproduct(req, res) {
        if (req.method === 'POST') {
            try {
                const { p_name, p_color, p_size, p_description, brand_name, active } = req.body;
                if (!p_name || !p_color || !p_size || !p_description || !brand_name) {
                    req.flash('err', 'All fields are required')
                    return res.redirect('/addproduct');
                }

                // Handle checkbox for p_color
                const p_colors = Array.isArray(p_color) ? p_color : [p_color];
                const p_sizes = Array.isArray(p_size) ? p_size : [p_size];

                if (!['true', 'false'].includes(active)) {
                    req.flash('err', 'Please active this product or not')
                    return res.redirect('/addproduct');
                }

                const productData = {
                    p_name: p_name.trim(),
                    p_color: p_colors,
                    p_size: p_sizes,
                    p_description: p_description.trim(),
                    image: req.file.path, // Image path for handling image
                    brand_name: brand_name.trim(),
                    active: active
                };
                const product = new Product(productData);
                await product.save();
                req.flash('sucess', 'Product sucessfully added')
                return res.redirect('/product');
            } catch (error) {
                console.error('Error saving product:', error);
                req.flash('err', 'Error adding product')
                return res.redirect('/addproduct');
            }
        }
        res.render('productview/addproduct', { user: req.user });
    }

    // Handle GET product
    async showproduct(req, res) {
        try {
            // Only admin can see all product 
            const query = req.user.role === 'admin' ? {} : { active: true };
            const products = await Product.find(query);
            res.render('productview/product', { products, user: req.user }); // Render the product page with products data
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving products" });
        }
    }

    // Handle GET single product 
    async singleproduct(req, res) {
        // Only admin can add the product
        // if (req.user.role !== 'admin') {
        //     req.flash('err', 'Only admin can edit product')
        //     return res.redirect('/product');
        // }
        const id = req.params.id;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('productview/editproduct', { product, user: req.user });
        } catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Error fetching product');
        }
    }

    // Handle PUT or PATCH for update product
    async updateproduct(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const product = await Product.findById(id); // Find product by id
        const imagePath = path.resolve(__dirname, '../../../', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', product.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            const { p_name, p_color, p_size, p_description, brand_name, active } = req.body;
            if (!p_name || !p_color || !p_size || !p_description || !brand_name) {
                return res.status(400).send('All fields are required.');
            }

            const p_colors = Array.isArray(p_color) ? p_color : [p_color];
            const p_sizes = Array.isArray(p_size) ? p_size : [p_size];

            if (!['true', 'false'].includes(active)) {
                return res.status(400).send('Active status is required');
            }

            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return res.status(404).send('Product not found.');
            }

            const productData = {
                p_name: p_name.trim(),
                p_color: p_colors,
                p_size: p_sizes,
                p_description: p_description.trim(),
                brand_name: brand_name.trim(),
                active: active,
                image: req.file ? req.file.path : existingProduct.image
            };

            // Update the product
            await Product.findByIdAndUpdate(id, productData);
            console.log(`Product with ID ${id} updated`);
            req.flash('sucess', 'Product updated successfully');
            return res.redirect('/product'); // Redirect after updating
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).send('Error updating product');
        }
    }


    // Handle DELETE for delete product
    async deleteproduct(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const product = await Product.findById(id); // Find product by id
        const imagePath = path.resolve(__dirname, '../../../', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', product.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            await Product.findByIdAndDelete(id);
            req.flash('sucess', "Product delete sucessfully")
            return res.redirect('/product'); // Redirect product after deleting data
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).send('Error deleting product');
        }
    }

}

module.exports = new productuicontroller();