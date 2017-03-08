/// <reference types="bluebird" />
import * as Promise from "bluebird";
import { Cellpack, Connection, Environment, Transmitter } from "microb";
export declare class Translator {
    private i18n;
    private environment;
    private transmitter;
    private config;
    private debug;
    constructor(i18n: any, i18nCellpack: CellpackI18n);
    translations(text: string, subs?: any): string;
}
export default class CellpackI18n extends Cellpack {
    private i18n;
    private debug;
    init(): Promise<void>;
    setLocale(connection: Connection, locale: string): void;
    getEnvironment(): Environment;
    getTransmitter(): Transmitter;
    request(connection: Connection): Promise<boolean>;
}
