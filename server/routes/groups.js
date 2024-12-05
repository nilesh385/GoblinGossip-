import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import {
  createGroup,
  deleteGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupDetails,
} from '../controllers/groupController.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createGroup);
router.delete('/:groupId', deleteGroup);
router.post('/:groupId/members/:userId', addMemberToGroup);
router.delete('/:groupId/members/:userId', removeMemberFromGroup);
router.get('/:groupId', getGroupDetails);

export default router;