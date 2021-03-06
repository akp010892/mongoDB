const express = require('express')
const tibco = express.Router();


var ObjectID = require('mongodb').ObjectID;

tibco.get('/getsolution', (req, res, next) => {
    const requestDb = req.app.locals.db.collection("getsolutions");
    requestDb.find().toArray((err, result) => {
        if (err) {
            res.status(400).send({ 'error': err })
        }
        if (result === undefined || result.length === 0) {
            res.status(400).send({ 'error': 'No Result Found in database' })
        } else {
            res.status(200).send(result)
        }
    })
})

tibco.delete('/getsolution/:id', (req, res, next) => {
    const requestDb = req.app.locals.db.collection("getsolutions");
    requestDb.deleteOne({
        '_id': ObjectID(req.params.id)
    }, (err, result) => {
        if (err) {
            res.status(400).send({ 'error': err })
        }
        res.status(200).send(result)
    })
})

tibco.get('/search', async (req, res, next) => {
    const requestDb = req.app.locals.db.collection("getsolutions");
    let response;
    try {
        const index = await requestDb.createIndex( { "$**": "text"} );
        response = await requestDb.find({$text: { $search: req.query.keyword }}).toArray();
        if (response === undefined || response.length === 0) {
            res.status(400).send({ 'error': 'No Result found in database' })
        } else {

            res.status(200).send(response);
        }
    } catch (error) {
        res.status(400).send({ 'error': error })
    }
})
tibco.post("/getsolution", (req, res) => {
    const requestDb = req.app.locals.db.collection("getsolutions");

    const body = {
        'title': req.body.title,
        'error_description': req.body.error_description,
        'solution': req.body.solution
    };
    requestDb.insertOne(body, (err, result) => {
        if (err) {
            res.status(400).send({ 'error': err })
        }
        res.status(200).send({ message: "Request created successfully" })
    })
});

module.exports = tibco