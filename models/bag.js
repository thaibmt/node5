const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
    title: String,
    price: {
        type: String,
        default: 0
    },
    description: String,
});

const Bag = mongoose.model('Bag', bagSchema);

module.exports = Bag;
