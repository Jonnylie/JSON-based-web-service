const express = require('express');
const app = express();

const invalidJson = { "error": "Could not decode request: JSON parsing failed" };

app.use(express.json({
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf); // if it parses invalidate JSON data, return a json response with an error message
        } catch (e) {
            res.status(400).send(invalidJson);
            throw Error('invalid JSON');
        }
    }
}));

app.post('/', (req, res) => {

    let arrOfObjects = new Object();
    let result = new Array;

    if (req.body.hasOwnProperty('payload')) { // if JSON data has payload as a key, grab the value. Otherwise, return an error
        arrOfObjects = req.body.payload;
    } else {
        res.status(400).send(invalidJson);
        throw Error('invalid JSON');
    }

    for (let obj of arrOfObjects) {

        let show = {};

        if (obj.drm === true && obj.episodeCount > 0) {
            const hasAllProperties = checkAllProperties(obj, 'image', 'slug', 'title'); // check whether we have all of three keys in each object
            if (hasAllProperties) { // if we have all of them, assign them to a newly created object
                show.image = obj.image.showImage;
                show.slug = obj.slug;
                show.title = obj.title;
                result.push(show);// push the object to an array
            }
        }

    }
    let json = new Object();
    json.response = result; // finally, add key value pair to a JSON
    res.send(json);
});

const checkAllProperties = (object, image, slug, title) => {
    if (object.hasOwnProperty(image) && object.hasOwnProperty(slug) && object.hasOwnProperty(title)) {
        return true;
    }
    return false;
}

module.exports = app;


