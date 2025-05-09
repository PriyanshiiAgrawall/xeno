import mongoose from "mongoose";

const CommunicationLogSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "sent", "failed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("CommunicationLog", CommunicationLogSchema);
