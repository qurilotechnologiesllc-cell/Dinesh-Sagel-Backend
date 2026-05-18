const express = require('express');
const router = express.Router();
const { createBanner, updateBanner, getBanners, deleteBanner } = require('../controllers/bannerController');
const { upload } = require('../utils/cloudinary');

router.post('/banners', upload.single('image'), createBanner);
router.get('/banners', getBanners);
router.put('/banners/:id', upload.single('image'), updateBanner);
router.delete('/banners/:id', deleteBanner);

module.exports = router;