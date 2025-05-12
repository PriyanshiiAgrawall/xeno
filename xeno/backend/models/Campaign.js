import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        campaignSize: { type: Number, required: true },

       
        rulesJSON: { type: Object, required: true, default: {} },

        segmentText: { type: String, required: true }, // Text description of segment which ai will convert to json

        personalizedCampignText: { type: String, default: "" }, // AI-generated or admin-written message

        resultText: { type: String, default: "" },

        communicationLogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CommunicationLog",
            },
        ],
        customers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Campaign", CampaignSchema);
