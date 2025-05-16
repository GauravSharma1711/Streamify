import express from 'express'

import {acceptFriendRequest, getFriendRequest, getMyFriends, getOngoingFriendRequest, 
    getRecomendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/',protectRoute,getRecomendedUsers);
router.get('/friends',protectRoute,getMyFriends);
router.get('/send',protectRoute,sendFriendRequest);
router.get('/accept',protectRoute,acceptFriendRequest);
router.get('/get',protectRoute,getFriendRequest);
router.get('/ongoing',protectRoute,getOngoingFriendRequest);

export default router