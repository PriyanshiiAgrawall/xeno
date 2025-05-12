import React, { useState } from "react";
import { QueryBuilder } from "react-querybuilder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PreviewModal from "./previewModal";
import "react-querybuilder/dist/query-builder.css";
import CreateCampaign from "./createCampaign";
import axios from "axios";

const customStyles = {
  deleteButton: "text-white bg-red-500 hover:bg-red-700 rounded p-2",
  ruleBackground: "bg-gray-100 p-4 mb-4 rounded",
  ruleBackgroundAlt: "bg-gray-200 p-4 mb-4 rounded",
};

export default function ManualSegmentForm() {
  const [query, setQuery] = useState({
    combinator: "and",
    rules: [
      { field: "daysInactive", operator: "=", value: "700" },
      { field: "totalSpend", operator: ">", value: "7000" },
      { field: "numberOfVisits", operator: "=", value: "3" },
      { field: "lastPurchaseDate", operator: ">", value: "2020-01-01" },
      { field: "isSubscribed", operator: "=", value: true },
      { field: "mostCategoryOfProductsPurchased", operator: "=", value: "electronics" },
    ],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fields = [
    { name: "daysInactive", label: "Days Inactive", type: "number" },
    { name: "totalSpend", label: "Total Spend", type: "number" },
    { name: "numberOfVisits", label: "Number of Visits", type: "number" },
    { name: "lastPurchaseDate", label: "Last Purchase Date", type: "date" },
    { name: "isSubscribed", label: "Is Subscribed", type: "boolean" },
    { name: "mostCategoryOfProductsPurchased", label: "Most Category of Products Purchased", type: "string" },
  ];

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
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
    <div className="p-6 space-y-6 max-w-full">
      <Card className="shadow-lg rounded-lg p-6 w-full">
        <h5 className="text-2xl font-semibold text-center mb-6">
          Create Customer Segment
        </h5>

        <div className="overflow-x-auto">
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={handleQueryChange}
            renderDeleteButton={() => (
              <button className={customStyles.deleteButton}>Delete</button>
            )}
            controlClassnames={{
              queryBuilder: 'whitespace-normal break-words',
              ruleGroup: 'whitespace-normal break-words',
              combinators: 'whitespace-normal break-words',
              addRule: 'whitespace-normal break-words',
              addGroup: 'whitespace-normal break-words',
              removeGroup: 'whitespace-normal break-words',
              removeRule: 'whitespace-normal break-words',
              rule: 'whitespace-normal break-words',
              fields: 'whitespace-normal break-words',
              operators: 'whitespace-normal break-words',
              value: 'whitespace-normal break-words',
            }}
          />
        </div>

        <div className="mt-6">
          <h6 className="text-xl font-medium">Segment Description:</h6>
          <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap break-words">
            {generateDescription(query)}
          </pre>
        </div>

        {/* <div className="mt-6 flex w-full justify-center space-x-4">
          <Button onClick={openModal}>Preview Matching Customers</Button>
        </div> */}
      </Card>

      <CreateCampaign
        query={query}
        generateDescription={generateDescription}
        openPreviewModal={openModal}
        handleCreateCampaign={handleCreateCampaign}
        isCreatingCampaign={isCreatingCampaign}
      />

      {isModalOpen && (
        <PreviewModal rule={query} onClose={closeModal} />
      )}
    </div>
  );
}
