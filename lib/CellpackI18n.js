"use strict";
const appRoot = require("app-root-path");
const Promise = require("bluebird");
const I18n = require("i18n");
const microb_1 = require("microb");
class CellpackI18n extends microb_1.Cellpack {
    init() {
        this.config = this.environment.get("cellpacks")["cellpack-i18n"];
        if (this.config.debug !== undefined)
            this.debug = this.config.debug;
        else
            this.config = this.environment.get('debug', false);
        this.i18n = {};
        I18n.configure({
            defaultLocale: this.config.defaultLocale || "en",
            register: this.i18n,
            directory: `${appRoot}/translations`
        });
        this.environment.add("template.filters", {
            name: "trans",
            class: this,
            func: this.translations
        });
        return Promise.resolve();
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
    }
    request(connection) {
        if (connection.request.attributes.has("locale"))
            this.i18n.setLocale(connection.request.attributes.get("locale"));
        if (connection.environment.has("cellpack.i18n.locale"))
            this.i18n.setLocale(connection.environment.get("cellpack.i18n.locale"));
        if (this.debug)
            this.transmitter.emit("log.cellpack.i18n", `Set Locale: ${this.i18n.getLocale()}`);
        return Promise.resolve(true);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CellpackI18n;
