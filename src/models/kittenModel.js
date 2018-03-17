import mongoose from 'mongoose';
import FleaModel from './fleaModel';
import SpeciesModel from './speciesModel'

const fleaModel = FleaModel.schemaType;

const Schema = mongoose.Schema;

const KittenSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
        weight: {type: Number, required: true},
        birth: {type: Date},
        colors: {
            primary: {type: String},
            secondary: {type: String}
        },
        fleas: [fleaModel],
        species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species', required:true}
    });
KittenSchema.methods.speak = () => {
    console.log(`My name is ${this.name}`);
};

module.exports = mongoose.model('Kitten', KittenSchema);