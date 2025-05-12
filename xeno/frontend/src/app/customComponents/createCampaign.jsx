"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";



const CreateCampaign = ({
  query,
  generateDescription,
  openPreviewModal,
  handleCreateCampaign,
}) => {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [message, setMessage] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAISuggestions = async () => {
  try {
    setIsGenerating(true);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/ai-compaign-messages`,
      {
        campaignTitle,
        message
      }
    );

    if (res.data?.suggestions) {
      setAiSuggestions(res.data.suggestions);
    } else {
     toast.error("No suggestions returned.");
    }
  } catch (error) {
    console.error("Failed to generate AI suggestions:", error);
    toast.error("Error generating AI suggestions");
  } finally {
    setIsGenerating(false);
  }
};


  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  const handleSubmit = async () => {
    if (!campaignTitle.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-campaign`,
        {
          campaignTitle,
          message,
          query
        }
      );

      if (response.data) {
        // Reset form
        setCampaignTitle("");
        setMessage("");
        setAiSuggestions([]);
        toast.success("Campaign created successfully!");
        // Optionally redirect to campaigns page
        window.location.href = "/campaign";
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast.error(error.response?.data?.message || "Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg p-6 w-full space-y-6">
      <h5 className="text-2xl font-semibold text-center">
        Create Campaign
      </h5>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Campaign Title</label>
          <Input
            placeholder="Enter campaign title"
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Campaign Message</label>
          <Textarea
            placeholder="Enter personalized message (use {{name}} for name)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full"
          />
          <div className="mt-2 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleAISuggestions}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Make it better with AI
                </>
              )}
            </Button>
          </div>

          {aiSuggestions.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                AI Suggested Messages:
              </p>
              {aiSuggestions.map((suggestion, index) => (
  <Button
    key={index}
    variant="secondary"
    className="w-full text-left"
    onClick={() => handleSuggestionClick(suggestion.message)} 
  >
    {suggestion.message}
  </Button>
))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h6 className="text-lg font-medium">Segment Description:</h6>
          <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap break-words text-sm">
            {generateDescription(query)}
          </pre>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={openPreviewModal}>
            Preview Matching Customers
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!campaignTitle.trim() || !message.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreateCampaign;
