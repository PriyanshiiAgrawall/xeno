"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ManualSegmentForm from "../customComponents/manualSegmentForm";
import GenerateRuleAI from "../customComponents/generateRuleAi";
import PreviewModal from "../customComponents/previewModal";
import { Sparkles } from "lucide-react";

export default function SegmentPage() {
  const [isManual, setIsManual] = useState(true);
  const [generatedRule, setGeneratedRule] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateRule = (rule) => {
    setGeneratedRule(rule);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create Segment</h1>
      <div className="space-x-4">
        <Button variant="outline" onClick={() => setIsManual(true)}>
          Create Segment Manually
        </Button>
        <Button variant="outline" onClick={() => setIsManual(false)}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Rule with AI
        </Button>
      </div>

      {isManual ? (
        <ManualSegmentForm />
      ) : (
        <GenerateRuleAI onGenerateRule={handleGenerateRule} />
      )}


      {showPreview && (
        <PreviewModal
          rule={generatedRule}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
