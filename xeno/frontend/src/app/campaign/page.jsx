"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function CampaignPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/get-all-campaigns`,{
        method: 'GET',
        credentials: 'include',})
                const data = await response.json();
                setCampaigns(data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Campaigns</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
                       <CardHeader>
    <CardTitle className="flex flex-col items-start gap-1">
      <div className="flex w-full justify-between items-center">
        <span>{campaign.title}</span>
        <Badge variant="outline">
          {format(new Date(campaign.createdAt), "MMM d, yyyy")}
        </Badge>
      </div>
      <p className="text-sm text-gray-500">{campaign.personalizedCampignText}</p> {/* Sub-header */}
    </CardTitle>
  </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Total Messages</p>
                                        <p className="text-2xl font-bold">{campaign.stats.total}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Campaign Size</p>
                                        <p className="text-2xl font-bold">{campaign.campaignSize}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-green-50 p-2 rounded">
                                        <p className="text-xs text-green-600">Sent</p>
                                        <p className="font-semibold text-green-700">{campaign.stats.sent}</p>
                                    </div>
                                    <div className="bg-yellow-50 p-2 rounded">
                                        <p className="text-xs text-yellow-600">Pending</p>
                                        <p className="font-semibold text-yellow-700">{campaign.stats.pending}</p>
                                    </div>
                                    <div className="bg-red-50 p-2 rounded">
                                        <p className="text-xs text-red-600">Failed</p>
                                        <p className="font-semibold text-red-700">{campaign.stats.failed}</p>
                                    </div>
                                   

                                   
                                </div>
                                <p className="text-sm">
  <span className="font-medium">Summary:</span>{' '}
  {campaign.resultText ? (
    <span>{campaign.resultText}</span>
  ) : (
    <span className="text-yellow-600 italic">Pending</span>
  )}
</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}