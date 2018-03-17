import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SpeciesSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
    });


module.exports = mongoose.model('Species', SpeciesSchema);