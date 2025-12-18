const Gallery = require('../models/Gallery');

// Create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const galleryItem = new Gallery({
      title,
      description,
      imageUrl,
      category
    });

    await galleryItem.save();
    res.status(201).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }
    updates.updatedAt = Date.now();

    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all gallery items (admin)
exports.getAllGalleryItemsAdmin = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};