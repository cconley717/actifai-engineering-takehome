const express = require('express');
const router = express.Router();
const { getUsersAndGroups, getUsers, getGroups } = require('../database/performance');
const { yearMonthValidator } = require('../validators/yearMonth');

/**
 * Performance Routes
 * ------------------
 * Provides endpoints for retrieving team performance metrics by year and month.
 * 
 * Endpoints:
 *   - /all    → Users and groups with average & total revenue.
 *   - /users  → Per-user revenue metrics.
 *   - /groups → Per-group revenue metrics.
 * 
 */

router.get('/all', yearMonthValidator, async (req, res) => {
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

module.exports = router;
