import Customer from "../models/customer.js";
import Order from "../models/order.js";
import Campaign from "../models/Campaign.js";
import CommunicationLog from "../models/CommunicationLog.js";
import { generateSummaryMessage } from "./aiSuggestionController.js";
import customer from "../models/customer.js";



// Add Customer Controller
export const addCustomer = async (req, res) => {
  try {
    console.log("hello")
    const {
      name,
      email,
      phone,
      city,
      accountType,
      totalSpend,
      numberOfVisits,
      daysInactive,
      lastPurchaseDate,
      isSubscribed,
      mostCategoryOfProductsPurchased,
      communicationLogs = [],
      campaigns = [],
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !city || !accountType) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Check for existing customer with the same email or phone
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingCustomer) {
      return res.status(400).json({ message: "Customer with this email or phone already exists." });
    }
    const isSubscribedBool = isSubscribed === "Yes";
    // Create new customer
    const newCustomer = new Customer({
      name,
      email,
      phone,
      city,
      accountType,
      totalSpend,
      numberOfVisits,
      daysInactive,
      lastPurchaseDate,
      isSubscribed: isSubscribedBool,
      mostCategoryOfProductsPurchased,
      communicationLogs,
      campaigns,
    });

    // Save the customer
    await newCustomer.save();
    console.log("Customer added successfully:", newCustomer);
    // Send a success response
    return res.status(201).json({
      message: "Customer added successfully.",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    return res.status(500).json({
      message: "An error occurred while adding the customer.",
    });
  }
};


export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({
      message: "An error occurred while fetching customers.",
    });
  }
}


export const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required." });
    }

    const orders = await Order.find({ customer: customerId }).sort({ orderDate: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
};


export const addOrder = async (req, res) => {
  try {
    const { customer, shippingAddress, totalProducts, totalAmount, orderDate, orderStatus, products } = req.body;

    // Validate required fields
    if (!customer || !shippingAddress || !totalProducts || !totalAmount) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Create new order
    const newOrder = new Order({
      customer,
      shippingAddress,
      totalProducts,
      totalAmount,
      orderDate: orderDate || new Date(),
      orderStatus: orderStatus || "Processing",
      products: products || []
    });

    // Save the order
    await newOrder.save();

    // Update customer's last purchase date and total spend
    await Customer.findByIdAndUpdate(customer, {
      lastPurchaseDate: newOrder.orderDate,
      $inc: { totalSpend: totalAmount, numberOfVisits: 1 }
    });

    // Send a success response
    return res.status(201).json({
      message: "Order added successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    return res.status(500).json({
      message: "An error occurred while adding the order.",
    });
  }
};

export const getOrderProducts = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ products: order.products || [] });
  } catch (error) {
    console.error("Error fetching order products:", error);
    return res.status(500).json({ message: "Failed to fetch order products." });
  }
};



// Controller function to get customers that match the generated rule
export const getMatchingCustomers = async (req, res) => {
  try {

    console.log("hello")
    const { rule } = req.body;

    let query = {};

    rule.rules.forEach((ruleItem) => {
      switch (ruleItem.field) {
        case "daysInactive":
          query.daysInactive = { $gte: Number(ruleItem.value) }; // Match customers inactive for a certain number of days
          break;
        case "totalSpend":
          query.totalSpend = { $gte: Number(ruleItem.value) }; // Match customers who have spent more than a certain amount
          break;
        case "numberOfVisits":
          query.numberOfVisits = { $gte: Number(ruleItem.value) }; // Match customers with a certain number of visits
          break;
        case "lastPurchaseDate":
          query.lastPurchaseDate = { $gte: new Date(ruleItem.value) }; // Match customers who made their last purchase after a certain date
          break;
        case "isSubscribed":
          query.isSubscribed = ruleItem.value; // Match customers based on their subscription status
          break;
        case "mostCategoryOfProductsPurchased":
          query.mostCategoryOfProductsPurchased = ruleItem.value; // Match customers based on most purchased category
          break;
        default:
          break;
      }
    });

    // Fetch matching customers from the database
    const matchingCustomers = await Customer.find(query);
    console.log(matchingCustomers)
    // Return the matched customers
    return res.status(200).json(matchingCustomers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch matching customers" });
  }
};

// Create Campaign Controller
export const createCampaign = async (req, res) => {
  try {
  
    const { campaignTitle, message, query } = req.body;
    console.log(campaignTitle, message, query)
    let mongoQuery = {};

    query.rules.forEach((ruleItem) => {
      switch (ruleItem.field) {
        case "daysInactive":
          mongoQuery.daysInactive = { $gte: Number(ruleItem.value) }; // Match customers inactive for a certain number of days
          break;
        case "totalSpend":
          mongoQuery.totalSpend = { $gte: Number(ruleItem.value) }; // Match customers who have spent more than a certain amount
          break;
        case "numberOfVisits":
          mongoQuery.numberOfVisits = { $gte: Number(ruleItem.value) }; // Match customers with a certain number of visits
          break;
        case "lastPurchaseDate":
          mongoQuery.lastPurchaseDate = { $gte: new Date(ruleItem.value) }; // Match customers who made their last purchase after a certain date
          break;
        case "isSubscribed":
          mongoQuery.isSubscribed = ruleItem.value; // Match customers based on their subscription status
          break;
        case "mostCategoryOfProductsPurchased":
          mongoQuery.mostCategoryOfProductsPurchased = ruleItem.value; // Match customers based on most purchased category
          break;
        default:
          break;
      }
    });
    // Find matching customers based on the query
    let matchingCustomers = await Customer.find(mongoQuery);

    // Create the campaign
    const campaign = new Campaign({
      title: campaignTitle,
      campaignSize: matchingCustomers.length,
      rulesJSON: query,
      segmentText: generateSegmentDescription(query),
      personalizedCampignText: message,
      customers: matchingCustomers.map(customer => customer._id),
    });

    // Save the campaign first to get its ID
    await campaign.save();

    // Create communication logs for each customer
    try {
      const communicationLogs = [];
      for (const customer of matchingCustomers) {
        const personalizedMessage = message.includes("{{name}}")
    ? message.replace("{{name}}", customer.name)
    : message;
        const log = new CommunicationLog({
          customer: customer._id,
          campaign: campaign._id,
          message: personalizedMessage,
          status: 'pending'
        });
        await log.save();
        communicationLogs.push(log._id);
      }

      
      campaign.communicationLogs = communicationLogs;
      await campaign.save();
      await customer.findByIdAndUpdate(customer._id, {
        $push: {
          campaigns: campaign._id,
          communicationLogs: log._id,
        },
      });
    

      // Update customers with campaign reference
      await Customer.updateMany(
        { _id: { $in: matchingCustomers.map(c => c._id) } },
        { $push: { campaigns: campaign._id } }
      );

      // Simulate message sending with random delays and statuses
    setTimeout(async () => {
  const logs = await CommunicationLog.find({ campaign: campaign._id });

  const statusPromises = logs.map(log => {
    return new Promise((resolve) => {
      const delay = Math.floor(Math.random() * 4000) + 1000;
      setTimeout(async () => {
        const status = Math.random() < 0.8 ? 'sent' : 'failed';
        log.status = status;
        await log.save();
        resolve(); // mark this log as done
      }, delay);
    });
  });

  // Wait for all statuses to be updated
  Promise.all(statusPromises)
    .then(async () => {
      console.log("All messages processed. Now generating summary.");
      await generateSummaryMessage(campaign._id); //  call your summary generator
    })
    .catch(error => {
      console.error("Error processing message statuses:", error);
    });
}, 1000);


  
    } catch (error) {
      console.error("Error creating communication logs:", error);
    }
    return res.status(201).json({
      message: "Campaign created successfully",
      campaign,
      matchingCustomersCount: matchingCustomers.length
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return res.status(500).json({
      message: "An error occurred while creating the campaign",
      error: error.message
    });
  }
};

// Helper function to generate segment description
const generateSegmentDescription = (query) => {
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


export const getAllCampaigns = async (req, res) => {
  try {
      console.log("hello")
    const campaigns = await Campaign.find()
      .populate("communicationLogs")
      .sort({ createdAt: -1 });

    // Get statistics for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const stats = await CommunicationLog.aggregate([
          {
            $match: {
              campaign: campaign._id,
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]);

        const statsObj = {
          total: 0,
          sent: 0,
          failed: 0,
          pending: 0,
        };

        stats.forEach((stat) => {
          statsObj[stat._id] = stat.count;
          statsObj.total += stat.count;
        });

        return {
          ...campaign.toObject(),
          stats: statsObj,
        };
      })
    );

    res.status(200).json(campaignsWithStats);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Error fetching campaigns", error: error.message });
  }
};

export default function handler(req, res) {
  console.log("hit")
  if (req.isAuthenticated() && req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }

  console.log(req.isAuthenticated)
  return res.status(401).json({ user: null });
}
