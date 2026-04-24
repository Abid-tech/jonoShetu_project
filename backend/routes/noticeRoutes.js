
const express = require('express');
const router = express.Router();
const noticeController = require('../controller/noticeController');


router.post('/', noticeController.createNotice);
router.put('/:id', noticeController.updateNotice);
router.delete('/:id', noticeController.deleteNotice);

router.get('/', noticeController.getNotices);
router.get('/:id', noticeController.getNoticeById);

module.exports = router;