import KittenRepository from "../repository/kittenRepository";
import _ from "underscore";
import HttpStatusService from "../services/httpStatusService";



export default class KittenController {

    constructor() {
        this.kittenRepository = new KittenRepository();
        this.httpStatusService = new HttpStatusService();
    }

    index(req, res) {
        res.render('index');
    }

    getKittens(req, res) {
        this.kittenRepository.getKittens()
            .then(kittens => this.sendJsonResponse(res, this.httpStatusService.ok, kittens))
            .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err));
    }

    getKittenByName(req, res) {
        this.kittenRepository.getKittenByName(req.body.name)
            .then(kitten => this.sendJsonResponse(res, this.httpStatusService.ok, kitten))
            .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err));
    }

    createKitten(req, res) {
        try {
            const information = this.verifyNewKitten(
                req.body.name,
                req.body.weight,
                req.body.birth,
                req.body.primaryColor,
                req.body.secondaryColor,
                req.body.speciesName
            );
            this.kittenRepository.createKitten(information[0], information[1])
                .then(kitten => this.sendJsonResponse(res, this.httpStatusService.ok, kitten))
                .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err));
        } catch(err) {
            this.sendJsonResponse(res, this.httpStatusService.internalServerError, {message: err.message})
        }
    }

    updateKitten(req, res) {
        let object = this.prepareKittenUpdate(req.body.weight, req.body.primaryColor, req.body.secondaryColor);
        this.kittenRepository.updateKitten(req.body.name, object)
            .then(kitten => this.sendJsonResponse(res, this.httpStatusService.ok, kitten))
            .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err));
    }

    killKitten(req, res) {
        this.kittenRepository.killKitten(req.body.name)
            .then(msg => this.sendJsonResponse(res, this.httpStatusService.ok, msg))
            .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err))
    }

    addFlea(req, res) {
        this.kittenRepository.addFlea(req.body.kittenName, req.body.fleaName, req.body.fleaNumber)
            .then(kitten => this.sendJsonResponse(res, this.httpStatusService.ok, kitten))
            .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err));
    }

    removeFlea(req, res) {
        this.kittenRepository.removeFlea(req.body.kittenName, req.body.fleaName)
            .then(kitten => this.sendJsonResponse(res, this.httpStatusService.ok, kitten))
            .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err))
    }

    sendJsonResponse(res, code, content) {
        res.status(code);
        res.json(content);
    }

    genocide(req, res) {
        if(_.isUndefined(req.body.id)) {
            this.sendJsonResponse(res, this.httpStatusService.internalServerError, {error: 'Species id est requis'})
        } else {
            this.kittenRepository.launchGenocide(req.body.id)
                .then(result => this.sendJsonResponse(res, this.httpStatusService.ok, result))
                .catch(err => this.sendJsonResponse(res, this.httpStatusService.internalServerError, err));
        }
    }

    verifyNewKitten(name, weight, birth, primaryColor, secondaryColor, speciesName) {
        if(_.isUndefined(name))
            throw new Error('Erreur, le nom est requis et doit être une string');
        if(_.isUndefined(weight))
            throw new Error('Erreur, le poid est requis et doit être un nombre');
        if(_.isUndefined(speciesName))
            throw new Error('Erreur, l\'espèce est requise');
        return [{
            name: name.trim(),
            weight: parseInt(weight.trim(), 10),
            birth: (_.isUndefined(birth) || !birth instanceof Date)? new Date(): birth,
            colors: {
                primary: (_.isUndefined(primaryColor) || typeof primaryColor !== 'string')? '': primaryColor.trim(),
                secondary: (_.isUndefined(secondaryColor) || typeof secondaryColor !== 'string')? '': secondaryColor.trim()
            },
            fleas: [],
        }, speciesName.trim()];
    }

    prepareKittenUpdate(weight, primaryColor, secondaryColor) {
        return {
            weight: (_.isUndefined(weight) || _.isEmpty(weight.trim()))? null : parseInt(weight.trim(), 10),
            primaryColor: (_.isUndefined(primaryColor) || _.isEmpty(primaryColor.trim()))? null : primaryColor.trim(),
            secondaryColor: (_.isUndefined(secondaryColor) || _.isEmpty(secondaryColor.trim()))? null: secondaryColor.trim()
        }
    }
}