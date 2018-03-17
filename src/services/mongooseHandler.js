import Mongoose from "mongoose";

export default class mongooseHandler
{
    constructor()
    {
        Mongoose.Promise = global.Promise;
        this.mongoose = Mongoose;
    }

    connect() {
        return new Promise((resolve, reject) => {
            let dbConnect;
            if(process.env.ENV !== 'development') {
                dbConnect = `mongodb://${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@${ process.env.DB_HOST }:${ process.env.DB_PORT }/${ process.env.DB_NAME }`
            } else {
                this.mongoose.set('debug', true);
                dbConnect = `mongodb://${ process.env.DB_HOST }:${ process.env.DB_PORT }/${ process.env.DB_NAME }`
            }
            this.mongoose.connect(dbConnect, {
                keepAlive: true,
                reconnectTries: Number.MAX_VALUE,
                useMongoClient: true
            }, err => {
                if(err)
                    reject(err);
                else
                    resolve("Mongoose connected");
            });
        });
    }
}