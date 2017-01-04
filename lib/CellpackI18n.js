"use strict";
const appRoot = require("app-root-path");
const Promise = require("bluebird");
const I18n = require("i18n");
const microb_1 = require("microb");
class CellpackI18n extends microb_1.Cellpack {
    init() {
        this.config = this.environment.get("cellpacks")["cellpack-i18n"];
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
        if (this.environment.get('debug'))
            this.transmitter.emit("log.cellpack.i18n", `Translation of: "${text}" with: ${subs}`);
        return this.i18n.__(text, subs);
    }
    request(connection) {
        if (connection.request.attributes.has("locale"))
            this.i18n.setLocale(connection.request.attributes.get("locale"));
        if (this.environment.get('debug'))
            this.transmitter.emit("log.cellpack.i18n", `Set Locale: ${this.i18n.getLocale()}`);
        return Promise.resolve(true);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CellpackI18n;