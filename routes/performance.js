const express = require('express');
const router = express.Router();
const { getUsers, getUser, getGroups, getGroup, getUsersAndGroups } = require('../database/performance');
const { yearMonthValidator } = require('../validators/yearMonth');
const { idValidator } = require('../validators/id');

/**
 * Performance Routes
 * ------------------
 * Provides endpoints for retrieving team performance metrics by year and month.
 * Metrics include average revenue and total revenue.
 * 
 * Endpoints:
 *   - /users            → All users revenue metrics.
 *   - /users/:userId    → Specific user revenue metrics.
 *   - /groups           → All groups revenue metrics.
 *   - /groups/:groupId  → Specific group revenue metrics.
 *   - /usersAndGroups   → All Users and All groups revenue metrics.
 */

router.get('/users', yearMonthValidator, async (req, res) => {
    try {
        const year = req.query.year;
        const month = req.query.month;

        const data = await getUsers(year, month);

        res.json(data);
    } 
    catch (err) { 
        next(err); 
    }
});

router.get('/users/:id', yearMonthValidator, idValidator, async (req, res) => {
    try {
        const year = req.query.year;
        const month = req.query.month;
        const id = req.params.id;

        const data = await getUser(year, month, id);

        res.json(data);
    } 
    catch (err) { 
        next(err); 
    }
});

router.get('/groups', yearMonthValidator, async (req, res) => {
    try {
        const year = req.query.year;
        const month = req.query.month;

        const data = await getGroups(year, month);

        res.json(data);
    } 
    catch (err) { 
        next(err); 
    }
});

router.get('/groups/:id', yearMonthValidator, idValidator, async (req, res) => {
    try {
        const year = req.query.year;
        const month = req.query.month;
        const id = req.params.id;

        const data = await getGroup(year, month, id);

        res.json(data);
    } 
    catch (err) { 
        next(err); 
    }
});

router.get('/usersAndGroups', yearMonthValidator, async (req, res) => {
    try {
        const year = req.query.year;
        const month = req.query.month;

        const data = await getUsersAndGroups(year, month);

        res.json(data);
    } 
    catch (err) { 
        next(err); 
    }
});

module.exports = router;
