/// <reference types="bluebird" />
import * as Promise from "bluebird";
import { Cellpack, Connection } from "microb";
export default class CellpackI18n extends Cellpack {
    private i18n;
    private debug;
    init(): Promise<void>;
    translations(text: string, subs?: any): string;
    request(connection: Connection): Promise<boolean>;
}
