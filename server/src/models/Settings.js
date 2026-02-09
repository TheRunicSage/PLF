import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },
    donationBankDetails: {
      type: String,
      default: '',
    },
    donationQrImageUrls: {
      type: [String],
      default: [],
    },
    externalDonateUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
