import express from 'express';

import handler, { addCustomer, addOrder, getCustomers, getOrdersByCustomerId, getOrderProducts, getMatchingCustomers, createCampaign, getAllCampaigns, logoutHandler } from '../controllers/adminController.js';
import { generatePersonalizedCampaignMessage, generateRuleWithAi } from '../controllers/aiSuggestionController.js';
const router = express.Router();


router.post('/addCustomer', addCustomer)
router.get('/getCustomers', getCustomers)
router.get('/getOrdersByCustomerId', getOrdersByCustomerId)
router.post('/addOrder', addOrder)
router.get('/getOrderProducts', getOrderProducts)
router.post('/match-customers', getMatchingCustomers)
router.post('/create-campaign', createCampaign)
router.get('/get-all-campaigns', getAllCampaigns)
router.post('/generate-rule',generateRuleWithAi)

router.post("/ai-compaign-messages", generatePersonalizedCampaignMessage);
// router.post("/generate-summary", generateSummaryMessage);
router.get("/status",handler)

router.get('/logout',logoutHandler);


export default router;