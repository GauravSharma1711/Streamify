import express from 'express'

import {acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequest, 
    getRecomendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/',protectRoute,getRecomendedUsers);
router.get('/friends',protectRoute,getMyFriends);

router.post('/friend-request/:id',protectRoute,sendFriendRequest);

router.put('/friend-request/:id/accept',protectRoute,acceptFriendRequest);

router.get('/friend-requests',protectRoute,getFriendRequest);

router.get('/outgoing-friend-requests',protectRoute,getOutgoingFriendRequest);

export default router