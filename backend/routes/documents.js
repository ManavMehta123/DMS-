const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png|doc|docx|txt|xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents and images are allowed'));
    }
  }
});

// Upload document
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const document = new Document({
      title: title || req.file.originalname,
      description: description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      tags: tagsArray,
      uploadedBy: req.userId,
      permissions: {
        viewers: [req.userId],
        editors: [req.userId]
      },
      versions: [{
        versionNumber: 1,
        filename: req.file.filename,
        uploadedAt: new Date(),
        uploadedBy: req.userId,
        comment: 'Initial upload'
      }]
    });

    await document.save();
    await document.populate('uploadedBy', 'username email');

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get all documents (with permissions check)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { uploadedBy: req.userId },
        { 'permissions.viewers': req.userId },
        { 'permissions.editors': req.userId }
      ]
    })
    .populate('uploadedBy', 'username email')
    .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search documents
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query, tags } = req.query;
    let searchCriteria = {
      $or: [
        { uploadedBy: req.userId },
        { 'permissions.viewers': req.userId },
        { 'permissions.editors': req.userId }
      ]
    };

    if (query) {
      searchCriteria.$text = { $search: query };
    }

    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim());
      searchCriteria.tags = { $in: tagsArray };
    }

    const documents = await Document.find(searchCriteria)
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get document by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'username email')
      .populate('permissions.viewers', 'username email')
      .populate('permissions.editors', 'username email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check permissions
    const hasAccess = document.uploadedBy._id.equals(req.userId) ||
                      document.permissions.viewers.some(v => v._id.equals(req.userId)) ||
                      document.permissions.editors.some(e => e._id.equals(req.userId));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update document
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has edit permission
    const canEdit = document.uploadedBy.equals(req.userId) ||
                    document.permissions.editors.some(e => e.equals(req.userId));

    if (!canEdit) {
      return res.status(403).json({ message: 'No edit permission' });
    }

    const { title, description, tags } = req.body;

    if (title) document.title = title;
    if (description !== undefined) document.description = description;
    if (tags) document.tags = tags.split(',').map(tag => tag.trim());

    await document.save();
    await document.populate('uploadedBy', 'username email');

    res.json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

// Upload new version
router.post('/:id/version', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const canEdit = document.uploadedBy.equals(req.userId) ||
                    document.permissions.editors.some(e => e.equals(req.userId));

    if (!canEdit) {
      return res.status(403).json({ message: 'No edit permission' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newVersion = {
      versionNumber: document.currentVersion + 1,
      filename: req.file.filename,
      uploadedAt: new Date(),
      uploadedBy: req.userId,
      comment: req.body.comment || 'Version update'
    };

    document.versions.push(newVersion);
    document.currentVersion += 1;
    document.filename = req.file.filename;
    document.originalName = req.file.originalname;
    document.fileType = req.file.mimetype;
    document.fileSize = req.file.size;

    await document.save();
    await document.populate('uploadedBy', 'username email');

    res.json({
      message: 'New version uploaded successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Version upload failed', error: error.message });
  }
});

// Update permissions
router.put('/:id/permissions', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can change permissions
    if (!document.uploadedBy.equals(req.userId)) {
      return res.status(403).json({ message: 'Only owner can change permissions' });
    }

    const { viewers, editors } = req.body;

    if (viewers) document.permissions.viewers = viewers;
    if (editors) document.permissions.editors = editors;

    await document.save();
    await document.populate('uploadedBy', 'username email');

    res.json({
      message: 'Permissions updated successfully',
      document
    });
  } catch (error) {
    res.status(500).json({ message: 'Permission update failed', error: error.message });
  }
});

// Delete document
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Only owner can delete
    if (!document.uploadedBy.equals(req.userId)) {
      return res.status(403).json({ message: 'Only owner can delete' });
    }

    // Delete all version files
    document.versions.forEach(version => {
      const filePath = path.join(__dirname, '..', 'uploads', version.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;
