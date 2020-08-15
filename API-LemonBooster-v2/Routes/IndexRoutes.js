const express = require('express');
const router = express.Router();

module.exports = () => {


    router.get('/', (req,res) => {
        res.status(200).json({
            success: true,
            msg: 'Ok.'
        });
    });

    return router;

}