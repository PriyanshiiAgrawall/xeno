import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },

        orderDate: { type: Date, default: Date.now },
        products: [{
            type: String,
        }],
        totalProducts: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        shippingAddress: {
            type: String,
            required: true
        },
        orderStatus: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing'
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', OrderSchema);
