import SpeciesModel from "../models/speciesModel";

export default class speciesRepository {
    constructor() {
        this.speciesModel = SpeciesModel;
    }

    getSpecies() {
        return new Promise((resolve, reject) => {
            this.speciesModel.find({})
                .then(fleas => resolve(fleas))
                .catch(err => reject(err));
        });
    }

    getSpecieById(id) {
        return new Promise((resolve, reject) => {
            this.speciesModel.findOne({_id: id})
                .then(specie => resolve(specie))
                .catch(err => reject(err));
        });
    }

    getSpecieByName(name) {
        return new Promise((resolve, reject) => {
            this.speciesModel.findOne({name: name})
                .then(specie => resolve(specie))
                .catch(err => reject(err));
        });
    }

    createSpecie(name) {
        return new Promise((resolve, reject) => {
            this.speciesModel.create({name: name})
                .then(flea => resolve(flea))
                .catch(err => reject(err));
        });
    }

    updateSpecie(id, name) {
        return new Promise((resolve, reject) => {
            this.getSpecieById(id).then(specie => {
                if(specie === null)
                    reject({error: 'Espèce introuvable'});
                if(typeof name !== 'undefined' || name !== null) {
                    specie.name = name;
                }
                specie.save().then(specie => resolve(specie)).catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }
}
