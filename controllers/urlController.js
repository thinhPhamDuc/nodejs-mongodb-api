const asyncHandler = require('express-async-handler')
const utils = require('../Util/utils')
const { Url } = require('../models/urlModel')
const nanoid = require('nanoid');
// const nanoid = require('nanoid');

// user 
const parseurl = asyncHandler(async (req, res) => {
    const { origUrl } = req.body;
    const base = process.env.BASE;

    const urlId = nanoid();
    if (utils.validateUrl(origUrl)) {
        try {
            const url = await Url.findOne({ "origUrl": origUrl });
            if (url) {
                res.json(url);
            } else {
                const shortUrl = `${base}/${urlId}`;

                uli = new Url({
                    origUrl:origUrl,
                    shortUrl:shortUrl,
                    urlId:urlId,
                    date: new Date(),
                });
                
                await uli.save();
                res.status(200).json(uli);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(400).json('Invalid Original Url');
    }
})

const url = asyncHandler(async (req, res) => {
    try {
        const url = await Url.findOne({ urlId: req.params.urlId });
        if (url) {
          await Url.updateOne(
            {
              urlId: req.params.urlId,
            },
            { $inc: { clicks: 1 } }
          );
          return res.redirect(url.origUrl);
        } else res.status(404).json('Not found');
      } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
      }
})


module.exports = {
    parseurl,
    url
}