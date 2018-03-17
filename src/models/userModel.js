import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userName: {type: String, required: true, unique: true},
        userMail: {type: String, required: true, unique: true},
        userPassword: {type: String, required: true},
        scenarios: [{
            label: {type: String},
            backGroundImagePath: {type: String},
            lastDateGame: {type: Date},
            steps: [{
                label: {type: String},
                backGroundImagePath: {type: String},
                players: [{
                    player: {
                        name: {type: String}
                    }
                }],
                isStarted: {type: Boolean},
                isCompleted: {type: Boolean},
                positions: [{
                    x: {type: Number},
                    y: {type: Number}
                }],
                asset: {
                    periods: [{
                        label: {type: String},
                        color: {type: String},
                        stepImages: [{
                            label: {type: String},
                            images: [{
                                order: {type: Number},
                                name: {type: String},
                                url: {type: String},
                                pathToImagesFolder: {type: String},
                            }]
                        }],
                        stepSounds: [{
                            label: {type: String},
                            sounds: [{
                                orders: [{type: Number}],
                                name: {type: String},
                                url: {type: String},
                                pathToSoundsFolder: {type: String},
                            }]
                        }],
                    }],
                    stepTexts: [{
                        label: {type: String},
                        texts: [{
                            name: {type: String},
                            text: {type: String},
                        }]
                    }]
                },
            }],
        }],
        imagesContainer: [{
            label: {type: String},
            images: [{
                name: {type: String},
                url: {type: String},
                pathToImagesFolder: {type: String},
            }]
        }],
        soundsContainer: [{
            label: {type: String},
            sounds: [{
                name: {type: String},
                url: {type: String},
                pathToSoundsFolder: {type: String},
            }]
        }],
        textsContainer: [{
            label: {type: String},
            texts: [{
                name: {type: String},
                text: {type: String},
            }]
        }],
    });


// species: {type: mongoose.Schema.Types.ObjectId, ref: 'Species', required:true}

module.exports = mongoose.model('User', UserSchema);