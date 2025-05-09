import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },

        orderDate: { type: Date, default: Date.now },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                totalPrice: { type: Number, required: true },//(quantity * price)
            }
        ],
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
        deliveryDate: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', OrderSchema);
