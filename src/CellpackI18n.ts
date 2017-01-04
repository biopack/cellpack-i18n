import * as appRoot from "app-root-path"
import * as Promise from "bluebird"
import * as I18n from "i18n"
//
import { Cellpack, Connection, Transmitter } from "microb"

export default class CellpackI18n extends Cellpack {

    private i18n: any

    init(){
        this.config = this.environment.get("cellpacks")["cellpack-i18n"]

        this.i18n = {}
        I18n.configure({
            defaultLocale: this.config.defaultLocale || "en",
            register: this.i18n,
            directory: `${appRoot}/translations`
        })

        this.environment.add("template.filters", {
            name: "trans",
            class: this,
            func: this.translations
        })

        return Promise.resolve()
    }

    translations(text: string, subs?: any){
        if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.i18n",`Translation of: "${text}" with: ${subs}`)
        return this.i18n.__(text,subs)
    }

    request(connection: Connection){
        if(connection.request.attributes.has("locale")) this.i18n.setLocale(connection.request.attributes.get("locale"))
        if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.i18n",`Set Locale: ${this.i18n.getLocale()}`)
        return Promise.resolve(true)
    }
}
