import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import KittenController from './controller/kittenController';


export default class Server {
    constructor()
    {
        this._app = express();

        this._app.use(express.static(path.join(__dirname, '/../public')));


        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: true}));


        this._app.set('view engine', 'twig');
        this._app.set('views', path.join(__dirname, '../src/views/'));

        this.port = process.env.PORT || 3000;
    }

    _initControllers()
    {
        const kittenController = new KittenController();

        this._app.get('/', kittenController.index.bind(kittenController));
        this._app.get('/kittens', kittenController.getKittens.bind(kittenController));
        this._app.post('/kittens/create', kittenController.createKitten.bind(kittenController));
        this._app.post('/kittens/get', kittenController.getKittenByName.bind(kittenController));
        this._app.put('/kittens/update', kittenController.updateKitten.bind(kittenController));
        this._app.delete('/kittens/delete', kittenController.killKitten.bind(kittenController));
        this._app.put('/kittens/flea/add', kittenController.addFlea.bind(kittenController));
        this._app.put('/kittens/flea/remove', kittenController.removeFlea.bind(kittenController));
        this._app.delete('/kittens/genocide', kittenController.genocide.bind(kittenController));
    }

    run()
    {
        this._initControllers();

        this._app.listen(this.port, () => console.log(`Server listening on port ${this.port}!`));
    }
}