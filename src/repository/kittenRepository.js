import UserModel from "../models/userModel";
import _ from "underscore";

export default class userRepository {
    constructor() {
        this.userModel = UserModel;
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            this.userModel.find({})
                .then(users => resolve(users))
                .catch(err => reject(err));
        });
    }

    getUserByMail(mail) {
        return new Promise((resolve, reject) => {
            this.userModel.findOne({userMail: mail})
                .then(kitten => resolve(kitten))
                .catch(err => reject(err));
        });
    }

    createUser(userDTO) {
        return new Promise((resolve, reject) => {

        });
    }

    updateKitten(name, object) {
        return new Promise((resolve, reject) => {
            this.getUserByMail(name)
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
            this.userModel.remove({name: name})
                .then(msg => resolve(msg))
                .catch(err => reject(err));
        });
    }
}
