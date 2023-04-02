const express = require("express");
const router = new express.Router();
const items = require("./fakeDb");
const ExpressError = require("./expressError");

router.get("/", function(req, res) {
    res.json(items);
  });

router.post("/", function(req, res, next) {
    console.log(req.body)
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError("Please provide item name AND price.", 400)
        const newItem = { name: req.body.name, price: req.body.price};
        items.push(newItem);
        return res.status(201).json({added: newItem})
    } catch (e) {
        return next(e)
    }
})

router.get("/:name", function(req, res, next) {
    console.log(req.params.name)
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
    }
    res.json({ foundItem })
})

router.patch("/:name", function(req, res, next) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
    }
    let oldInfo = {name: foundItem.name, price: foundItem.price};
    if (req.body.name) foundItem.name = req.body.name;
    if (req.body.price) foundItem.price = req.body.price;
    res.json({originalItemInfo: oldInfo, newItemInfo: foundItem})
})
router.delete("/:name", function(req, res, next) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
        }
    items.splice(foundItem, 1)
    res.json({ message: "Deleted" })
})
module.exports = router;