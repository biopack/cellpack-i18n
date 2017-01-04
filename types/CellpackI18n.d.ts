/// <reference types="bluebird" />
import * as Promise from "bluebird";
import { Cellpack, Connection } from "microb";
export default class CellpackI18n extends Cellpack {
    private i18n;
    init(): Promise<void>;
    translations(text: string, subs?: any): any;
    request(connection: Connection): Promise<boolean>;
}
