import {createConnection} from "typeorm";
import { Injectable } from '@angular/core';

/*
 Generated class for the DbProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class DbProvider {

    constructor() {
        createConnection({
            type: "sqlite",
            database: "__vndb__",
            entities: [
                __dirname + "/entities/*.js"
            ],
            autoSchemaSync: true,
        }).then(connection => {
            console.log('create db success: ', connection);
        }).catch(error => console.log(error));

    }
}
