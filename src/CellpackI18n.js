"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appRoot = require("app-root-path");
const Promise = require("bluebird");
const I18n = require("i18n");
const microb_1 = require("microb");
class Translator {
    constructor(i18n, i18nCellpack) {
        this.i18n = i18n;
        this.environment = i18nCellpack.getEnvironment();
        this.transmitter = i18nCellpack.getTransmitter();
        this.config = this.environment.get("cellpacks")["cellpack-i18n"];
        if (this.config.debug !== undefined)
            this.debug = this.config.debug;
        else
            this.config = this.environment.get('debug', false);
    }
    translations(text, subs) {
        if (this.debug)
            this.transmitter.emit("log.cellpack.i18n", `Translation of: "${text}" with: ${subs}`);
        try {
            return this.i18n.__(text, subs);
        }
        catch (err) {
            this.transmitter.emit("log.cellpack.i18n", `Translation Error: "${err}" in: ${text} with: ${subs}`);
            if (this.debug) {
                return `<div class="microb-error" style="color:red; background-color:#fee; border:solid 1px #f00; border-radius:3px; padding:10px; font-size:1em; font-family:Monospace"><strong>Translation error: </strong>${err}<br><strong>In: </strong>${text}<br><strong>With: </strong>${subs}</div>`;
            }
        }
        return "";
    }
}
exports.Translator = Translator;
class CellpackI18n extends microb_1.Cellpack {
    init() {
        this.config = this.environment.get("cellpacks")["cellpack-i18n"];
        if (this.config.debug !== undefined)
            this.debug = this.config.debug;
        else
            this.config = this.environment.get('debug', false);
        return Promise.resolve();
    }
    setLocale(connection, locale) {
        let i18n = {};
        I18n.configure({
            defaultLocale: this.config.defaultLocale || "en",
            register: i18n,
            directory: `${appRoot}/translations`
        });
        i18n.setLocale(locale);
        if (this.debug)
            this.transmitter.emit("log.cellpack.i18n", `Set Locale: ${i18n.getLocale()}`);
        connection.environment.set("cellpack.i18n", new Translator(i18n, this));
    }
    getEnvironment() {
        return this.environment;
    }
    getTransmitter() {
        return this.transmitter;
    }
    request(connection) {
        connection.environment.add("template.filters", {
            name: "trans",
            class: connection.environment.get("cellpack.i18n"),
            func: connection.environment.get("cellpack.i18n").translations
        });
        return Promise.resolve(true);
    }
}
exports.default = CellpackI18n;
