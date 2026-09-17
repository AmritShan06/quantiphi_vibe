const express = require('express');
const ProjectController = require('../controllers/projectController');

const router = express.Router();

router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.post('/:id/members', ProjectController.addMemberToProject);
router.get('/:id/members', ProjectController.getProjectMembers);

module.exports = router;
