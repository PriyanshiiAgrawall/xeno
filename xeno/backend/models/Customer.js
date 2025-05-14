import mongoose from "mongoose";


const CustomerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: { type: String, unique: true, required: true },
        city: { type: String, required: true },
        accountType: { type: String, enum: ['New', 'VIP', 'Regular'], required: true },

        totalSpend: { type: Number, default: 0 },
        numberOfVisits: { type: Number, default: 0 },
        daysInactive: { type: Number, default: 0 },
        lastPurchaseDate: { type: Date, default: null },
        isSubscribed: { type: Boolean, default: true },
        mostCategoryOfProductsPurchased: {
            type: String, default: null
        },

        communicationLogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CommunicationLog',
            }
        ],
        campaigns: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Campaign',

            }
        ],
    },
    {
        timestamps: true,
    }
);


export default mongoose.model('Customer', CustomerSchema);
