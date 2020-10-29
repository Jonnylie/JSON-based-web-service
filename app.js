const express = require('express');
const app = express();

const invalidJson = { "error": "Could not decode request: JSON parsing failed" };

app.use(express.json({
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).send(invalidJson);
            throw Error('invalid JSON');
        }
    }
}));

app.post('/', (req, res) => {

    let arrOfObjects = new Object();
    let result = new Array;

    if (req.body.hasOwnProperty('payload')) {
        arrOfObjects = req.body.payload;
    } else {
        res.status(400).send(invalidJson);
        throw Error('invalid JSON');
    }

    for (let obj of arrOfObjects) {

        let show = {};

        if (obj.drm === true && obj.episodeCount > 0) {
            const hasAllProperties = checkAllProperties(obj, 'image', 'slug', 'title');
            if (hasAllProperties) {
                show.image = obj.image.showImage;
                show.slug = obj.slug;
                show.title = obj.title;
                result.push(show);
            }
        }

    }
    let json = new Object();
    json.response = result;
    res.send(json);
});

const checkAllProperties = (object, image, slug, title) => {
    if (object.hasOwnProperty(image) && object.hasOwnProperty(slug) && object.hasOwnProperty(title)) {
        return true;
    }
    return false;
}

module.exports = app;
// app.listen(3000, () => console.log('Listening on Port 3000'));

