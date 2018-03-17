import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FleaSchema = new Schema(
    {
        fleaName: {type: String, required: true},
        elements: {type: Number}
    });

// Tricks pour pouvoir nester les schemas
const handler = {
    schemaType: FleaSchema,
    mongooseSchema: mongoose.model('Flea', FleaSchema)
};

module.exports = handler;