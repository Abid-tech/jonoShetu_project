
const express = require('express');
const router = express.Router();
const govLinkController = require('../controller/govLinkController');


router.post('/', govLinkController.createLink);
router.put('/:id', govLinkController.updateLink);
router.delete('/:id', govLinkController.deleteLink);


router.get('/', govLinkController.getLinks);
router.get('/:id', govLinkController.getLinkById);

module.exports = router;