const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'exam_config',
    },
    durationMinutes: {
      type: Number,
      default: 40,
    },
    showExplanations: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

settingSchema.statics.getConfig = async function () {
  let config = await this.findOne({ key: 'exam_config' });
  if (!config) {
    config = await this.create({
      key: 'exam_config',
      durationMinutes: 40,
      showExplanations: true,
    });
  }
  return config;
};

module.exports = mongoose.model('Setting', settingSchema);
