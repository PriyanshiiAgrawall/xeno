import JSON5 from "json5"; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Campaign from "../models/Campaign.js";
dotenv.config(); 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function run(userInput) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Convert the following user request into a valid rule JSON object for filtering customers in a CRM system.

Format:
{
  "combinator": "and" or "or",
  "rules": [
    {
      "field": "totalSpend" | "numberOfVisits" | "daysInactive" | "lastPurchaseDate" | "isSubscribed" | "mostCategoryOfProductsPurchased",
      "operator": ">" | "<" | "=",
      "value": number or string
    }
  ]
}

Only return raw JSON. Do not explain anything.

User request: "${userInput}"
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates[0].content.parts[0].text;

    // 🧼 Extract only the first {...} JSON block using regex
    const jsonMatch = responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    const jsonString = jsonMatch[0];

    return jsonString; // safe to JSON.parse later
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    return null;
  }
}

export default run;



export const generateRuleWithAi = async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "Missing user input" });
  }

  try {
    const jsonString = await run(userInput);

    if (!jsonString) {
      return res.status(500).json({ error: "No JSON returned by AI" });
    }
    console.log("🧾 Cleaned AI response before parsing:\n", jsonString);


   const parsedRule = JSON5.parse(jsonString); // now safe

    return res.status(200).json({ rule: parsedRule });
  } catch (error) {
    console.error("AI Rule Parse Error:", error.message);
    return res.status(500).json({ error: "Failed to generate rule" });
  }
};

export const generatePersonalizedCampaignMessage = async (req, res) => {
console.log("hello");
  const { campaignTitle, message } = req.body;

  if (!campaignTitle || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Generate 3 short(no more than 10 words), personalized, engaging customer campaign messages.
Title: "${campaignTitle}"
Offer: "${message}"

Include the customer's name using {{name}}.Don't add [link]. Be polite, include offers or urgency, and avoid long messages. Return them in a JSON array.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.candidates[0].content.parts[0].text;

    // Clean and parse Gemini's output
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const suggestions = JSON.parse(cleaned);
    console.log(suggestions)
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    res.status(500).json({ error: "Failed to generate AI suggestions" });
  }
};



export const generateSummaryMessage = async (req, res) => {
  const { campaignId } = req.body;

  if (!campaignId) {
    return res.status(400).json({ error: "Campaign ID is required" });
  }

  try {
    
    const campaign = await Campaign.findById(campaignId).populate("communicationLogs");
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const totalMessages = campaign.communicationLogs.length;
    const sentMessages = campaign.communicationLogs.filter(log => log.status === 'sent').length;
    const deliveryRate = totalMessages > 0 ? ((sentMessages / totalMessages) * 100).toFixed(2) : 0;

   
    const summary = `${campaign.title} reached ${campaign.campaignSize} users. ${sentMessages} messages were delivered with a ${deliveryRate}% delivery rate.`;

    
    campaign.resultText = summary;
    await campaign.save();

    res.status(200).json({ message: "Summary generated and saved", summary });
  } catch (error) {
    console.error("Error generating campaign summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
