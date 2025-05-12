// components/GenerateRuleAI.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CreateCampaign from "./createCampaign";
import PreviewModal from "./previewModal";
import axios from "axios";

export default function GenerateRuleAI({ onGenerateRule }) {
  const [input, setInput] = useState("");
  const [generatedRule, setGeneratedRule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

 const handleGenerate = async () => {
  try {
    console.log(input)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/generate-rule`, { userInput: input });
    if (res.data && res.data.rule) {
      setGeneratedRule(res.data.rule);
      onGenerateRule(res.data.rule);
    } else {
      alert("No rule returned.");
    }
  } catch (error) {
    console.error("Failed to generate rule:", error);
    alert("Error generating rule");
  }
};


  const generateDescription = (query) => {
    let description = "Creating Campaign for customers who are ";

    query.rules.forEach((rule, index) => {
      if (rule.field === "daysInactive") {
        description += `inactive for ${rule.value} days`;
      } else if (rule.field === "totalSpend") {
        description += `who have spent more than ${rule.value}`;
      } else if (rule.field === "numberOfVisits") {
        description += `who have visited ${rule.value} times`;
      } else if (rule.field === "lastPurchaseDate") {
        description += `who made their last purchase after ${rule.value}`;
      } else if (rule.field === "isSubscribed") {
        description += `who are ${rule.value ? "subscribed" : "not subscribed"}`;
      } else if (rule.field === "mostCategoryOfProductsPurchased") {
        description += `who most frequently purchased ${rule.value} products`;
      }

      if (index < query.rules.length - 1) {
        description += " and ";
      }
    });

    return description;
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      if (!campaignData.campaignTitle || !campaignData.message) {
        return;
      }

      setIsCreatingCampaign(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-campaign`,
        {
          campaignTitle,
          message,
          query
        }
      );

      if (response.data) {
        // Reset form or redirect as needed
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Generate Rule with AI</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="4"
          placeholder='Customers who have purchased more than 3 times and spent more than rupees 1000'
          className="w-full p-2 border rounded"
        />
        <Button onClick={handleGenerate} className="mt-4">
          Generate Rule
        </Button>

        {generatedRule && (
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-2">Generated Rule</h3>
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap break-words">
              {JSON.stringify(generatedRule, null, 2)}
            </pre>
          </div>
        )}
      </Card>

      {generatedRule && (
        <CreateCampaign
          query={generatedRule}
          generateDescription={generateDescription}
          openPreviewModal={openModal}
          handleCreateCampaign={handleCreateCampaign}
          isCreatingCampaign={isCreatingCampaign}
        />
      )}

      {isModalOpen && (
        <PreviewModal rule={generatedRule} onClose={closeModal} />
      )}
    </div>
  );
}
