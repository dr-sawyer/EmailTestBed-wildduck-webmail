'use strict';

const config = require('wild-config');
const express = require('express');
const router = new express.Router();
const apiClient = require('../lib/api-client');
const Joi = require('joi');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/help', (req, res) => {
    res.render('help', {
        activeHelp: true,
        setup: config.setup,
        use2fa: res.locals.user && res.locals.user.enabled2fa && res.locals.user.enabled2fa.length
    });
});

router.get('/tos', (req, res) => {
    res.render('tos', {
        activeCreate: true
    });
});

router.get('/flow/start', (req, res) => {
    apiClient.flow.start(req.user, (err, response) => {
        if (err || !response) {
            req.flash('danger', 'Fail to start the test');
            res.redirect('/webmail');
        } else if (response.success) {
            req.flash('success', 'Test started');
            res.redirect('/webmail');
        }
    })  
})

router.get('/flow-response/:response/:uid', (req, res) => {
    const schema = Joi.object().keys({
        response: Joi.string().valid('reply', 'report'),
        uid: Joi.number().min(1)
    });

    let result = Joi.validate(req.params, schema, {
        abortEarly: false,
        convert: true,
        allowUnknown: true
    });

    if (result.error) {
        if (result.error && result.error.details) {
            result.error.details.forEach(detail => {
                req.flash('danger', detail.message);
            });
        }
    }    

    let response = result.value.response;
    let uid = result.value.uid;

    apiClient.flow.response(response, uid, req.user, (err, response) => {
        if (err || !response) {
            console.error(err || response)
            req.flash('danger', 'Fail to start next step');
            res.redirect('/webmail');
        } else if (response.success) {
            if (response.msg) {
                req.flash('success', response.msg);
            } else {
                req.flash('success', 'Next step started');
            }
            
            res.redirect('/webmail');
        }
    })  
})
module.exports = router;
