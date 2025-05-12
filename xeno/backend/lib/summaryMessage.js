import Campaign from "../models/Campaign.js";

 async function generateSummaryMessagee(campaignId){

  if (!campaignId) {
    return null;
  }

  try {
    
    const campaign = await Campaign.findById(campaignId).populate("communicationLogs");
    if (!campaign) {
     return null;
    }

    const totalMessages = campaign.communicationLogs.length;
    const sentMessages = campaign.communicationLogs.filter(log => log.status === 'sent').length;
    const deliveryRate = totalMessages > 0 ? ((sentMessages / totalMessages) * 100).toFixed(2) : 0;

   
    const summary = `${campaign.title} reached ${campaign.campaignSize} users. ${sentMessages} messages were delivered with a ${deliveryRate}% delivery rate.`;

    
    campaign.resultText = summary;
    await campaign.save();
console.log(summary)
    return summary;
  } catch (error) {
    console.error("Error generating campaign summary:", error);
    return null;
  }
};

export default generateSummaryMessagee;