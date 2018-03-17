import KittenModel from "../models/kittenModel";
import FleaRepository from "./fleaRepository";
import SpeciesRepository from "./speciesRepository";
import _ from "underscore";

export default class kittenRepository {
    constructor() {
        this.kittenModel = KittenModel;
        this.fleaRepository = new FleaRepository();
        this.speciesRepository = new SpeciesRepository();
    }

    getKittens() {
        return new Promise((resolve, reject) => {
            this.kittenModel.find({})
                .then(kittens => resolve(kittens))
                .catch(err => reject(err));
        });
    }

    getKittenByName(name) {
        return new Promise((resolve, reject) => {
            this.kittenModel.findOne({name: name})
                .then(kitten => resolve(kitten))
                .catch(err => reject(err));
        });
    }

    createKitten(kitten, specieName) {
        return new Promise((resolve, reject) => {
            this.speciesRepository.getSpecieByName(specieName)
                .then(specie => {
                    if(specie === null) {
                        this.speciesRepository.createSpecie(specieName).then(newSpecie => {
                            kitten.species = newSpecie._id;
                            this.kittenModel.create(kitten)
                                .then(kitten => resolve(kitten))
                                .catch(err => reject(err));
                        }).catch(err => reject(err));
                    } else {
                        kitten.species = specie._id;
                        this.kittenModel.create(kitten)
                            .then(kitten => resolve(kitten))
                            .catch(err => reject(err));
                    }
                }).catch(err => reject(err));
        });
    }

    updateKitten(name, object) {
        return new Promise((resolve, reject) => {
            this.getKittenByName(name)
                .then(kitten => {
                    if(_.isNull(kitten)) {
                        reject({erreur: 'Chaton introuvable'});
                    } else {
                        kitten.weight = (object.weight === null)? kitten.weight : object.weight;
                        kitten.colors.primary = (object.primaryColor === null)? kitten.colors.primary : object.primaryColor;
                        kitten.colors.secondary = (object.secondaryColor === null)? kitten.colors.secondary : object.secondaryColor;
                        kitten.save().then(kitten => resolve(kitten)).catch(err => reject(err));
                    }
                }).catch(err => reject(err));
        });
    }

    killKitten(name) {
        return new Promise((resolve, reject) => {
            this.kittenModel.remove({name: name})
                .then(msg => resolve(msg))
                .catch(err => reject(err));
        });
    }

    addFlea(kittenName, fleaName, fleaNumber) {
        return new Promise((resolve, reject) => {
            this.getKittenByName(kittenName).then(kitten => {
                if(!_.isNull(kitten)) {
                    this.fleaRepository.getFleaByName(fleaName).then(flea => {
                        if(_.isNull(flea)) {
                            this.fleaRepository.createFlea(fleaName).then(flea => {
                                flea.elements = fleaNumber;
                                if(this.infestKitten(kitten, flea)) {
                                    kitten.save()
                                        .then(kitten => resolve(kitten))
                                        .catch(err => reject(err));
                                } else {
                                    reject({error: 'WTF you shouldn\'t be able to go here'});
                                }
                            }).catch(err => reject(err));
                        } else {
                            flea.elements = fleaNumber;
                            if(this.infestKitten(kitten, flea)) {
                                kitten.save().then(kitten => {
                                    resolve(kitten);
                                }).catch(err => reject(err));
                            } else {
                                reject({error: 'Erreur, la puce est déjà présente'});
                            }
                        }
                    }).catch(err => reject(err));
                } else {
                    reject({error: 'Le chaton n\'existe pas'});
                }
            }).catch(err => reject(err));
        });
    }

    infestKitten(kitten, flea) {
        const index = kitten.fleas.findIndex(fleaInArray => fleaInArray.fleaName === flea.fleaName);
        if (index === -1) {
            kitten.fleas.push(flea);
            return true
        } else {
            return false;
        }
    }

    removeFlea(kittenName, fleaName) {
        return new Promise((resolve, reject) => {
            this.getKittenByName(kittenName).then(kitten => {
                if(!_.isNull(kitten)) {
                    if(this.vermifugeKitten(kitten, fleaName)) {
                        kitten.save()
                            .then(kitten => resolve(kitten))
                            .catch(err => reject(err));
                    } else {
                        reject({error: 'Erreur, rien à vermifuger'})
                    }
                } else {
                    reject({error: 'Le chaton n\'existe pas'});
                }
            }).catch(err => reject(err));
        });
    }

    vermifugeKitten(kitten, fleaName) {
        const index = kitten.fleas.findIndex(fleaInArray => fleaInArray.fleaName === fleaName);
        if (index !== -1) {
            kitten.fleas.splice(index, 1);
            return true
        } else {
            return false;
        }
    }

    launchGenocide(id) {
        return new Promise((resolve, reject) => {
            this.speciesRepository.speciesModel.remove({_id: id})
                .then(() => {
                    this.kittenModel.find({species: id})
                        .then(kittens => {
                            let result = {};
                            result.message = "This kittens died by your sadism, are you happy ?";
                            result.names = [];
                            kittens.forEach(kitten => {
                                let name = kitten.name;
                                result.names.push(name);
                                this.killKitten(kitten.name).then(() => {}).catch(err => console.log(err));
                            });
                            resolve(result);
                        }).catch(err => reject(err));
                }).catch(err => reject(err));
        });
    }
}
