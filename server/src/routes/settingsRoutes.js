import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware.js';
import Settings from '../models/Settings.js';
import { sendSuccess } from '../utils/httpResponse.js';

const router = express.Router();

const getSingletonSettings = async () => {
  let settings = await Settings.findOne({ key: 'main' });

  if (!settings) {
    settings = await Settings.create({ key: 'main' });
  }

  return settings;
};

router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await getSingletonSettings();

    return sendSuccess(res, {
      donationBankDetails: settings.donationBankDetails,
      donationQrImageUrls: settings.donationQrImageUrls,
      externalDonateUrl: settings.externalDonateUrl,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/admin/settings', authMiddleware, async (_req, res, next) => {
  try {
    const settings = await getSingletonSettings();

    return sendSuccess(res, settings);
  } catch (error) {
    return next(error);
  }
});

router.put('/admin/settings', authMiddleware, async (req, res, next) => {
  try {
    const settings = await getSingletonSettings();

    settings.donationBankDetails = req.body.donationBankDetails ?? settings.donationBankDetails;
    settings.donationQrImageUrls = Array.isArray(req.body.donationQrImageUrls)
      ? req.body.donationQrImageUrls
      : settings.donationQrImageUrls;
    settings.externalDonateUrl = req.body.externalDonateUrl ?? settings.externalDonateUrl;

    await settings.save();

    return sendSuccess(res, settings);
  } catch (error) {
    return next(error);
  }
});

export default router;
