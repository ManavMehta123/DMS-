const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: {
    viewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    editors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  versions: [{
    versionNumber: Number,
    filename: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String
  }],
  currentVersion: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Add text index for search functionality
documentSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Document', documentSchema);
