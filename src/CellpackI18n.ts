import * as appRoot from "app-root-path"
import * as Promise from "bluebird"
import * as I18n from "i18n"
//
import { Cellpack, Connection, Transmitter } from "microb"

export default class CellpackI18n extends Cellpack {

    private i18n: any
    // own config - TODO: own structure?
    private debug: boolean
    // defaultLocale: string

    init(){
        // own config
        this.config = this.environment.get("cellpacks")["cellpack-i18n"]
        // debug
        if(this.config.debug !== undefined) this.debug = this.config.debug
        else this.config = this.environment.get('debug',false)

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
        if(this.debug) this.transmitter.emit("log.cellpack.i18n",`Translation of: "${text}" with: ${subs}`)
        try {
            return this.i18n.__(text,subs)
        } catch(err){
            this.transmitter.emit("log.cellpack.i18n",`Translation Error: "${err}" in: ${text} with: ${subs}`)
            if(this.debug){
                return `<div class="microb-error" style="color:red; background-color:#fee; border:solid 1px #f00; border-radius:3px; padding:10px; font-size:1em; font-family:Monospace"><strong>Translation error: </strong>${err}<br><strong>In: </strong>${text}<br><strong>With: </strong>${subs}</div>`
            }
        }
    }

    request(connection: Connection){
        if(connection.request.attributes.has("locale")) this.i18n.setLocale(connection.request.attributes.get("locale"))
        if(connection.environment.has("cellpack.i18n.locale")) this.i18n.setLocale(connection.environment.get("cellpack.i18n.locale"))
        if(this.debug) this.transmitter.emit("log.cellpack.i18n",`Set Locale: ${this.i18n.getLocale()}`)
        return Promise.resolve(true)
    }
}
