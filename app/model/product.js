const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    p_name: {
        type: String,
        required: "p_name is required",
        minlength: [3, 'p_name must be at least 3 characters']
    },
    p_color: {
        type: Array, // Array of strings for colors
        validate: {
            validator: function (v) {
                return v.length > 0; // Must have at least one color
            },
            message: "Please select atleast one color"
        }
    },
    p_size: {
        type: Array, // Array of strings for sizes
        validate: {
            validator: function (v) {
                return v.length > 0; // Must have at least one size
            },
            message: "Please select atleast one size."
        }
    },
    p_description: {
        type: String,
        required: "p_description is required",
        minlength: [10, 'p_description must be at least 10 characters']
    },
    image: {
        type: String,
        required: "Enter image it is Required"
    },
    brand_name: {
        type: String,
        required: "Brand is required",
        minlength: [3, 'Brand must be at least 3 characters']
    },
    active: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;