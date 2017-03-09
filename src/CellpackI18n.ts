import * as appRoot from "app-root-path"
import * as Promise from "bluebird"
import * as I18n from "i18n"
//
import { Cellpack, Connection, Environment, Transmitter } from "microb"

export class Translator {

    private i18n: any
    // private i18nCellpack: Cellpack
    //
    private environment: Environment
    private transmitter: Transmitter
    private config: any
    private debug: boolean

    constructor(i18n: any, i18nCellpack: CellpackI18n){
        this.i18n = i18n
        // this.i18nCellpack = i18nCellpack
        this.environment = i18nCellpack.getEnvironment()
        this.transmitter = i18nCellpack.getTransmitter()

        //
        this.config = this.environment.get("cellpacks")["cellpack-i18n"]

        if(this.config.debug !== undefined) this.debug = this.config.debug
        else this.config = this.environment.get('debug',false)
    }

    translations(text: string, subs?: any): string {
        if(this.debug) this.transmitter.emit("log.cellpack.i18n",`Translation of: "${text}" with: ${subs}`)
        try {
            return this.i18n.__(text,subs)
        } catch(err){
            this.transmitter.emit("log.cellpack.i18n",`Translation Error: "${err}" in: ${text} with: ${subs}`)
            if(this.debug){
                return `<div class="microb-error" style="color:red; background-color:#fee; border:solid 1px #f00; border-radius:3px; padding:10px; font-size:1em; font-family:Monospace"><strong>Translation error: </strong>${err}<br><strong>In: </strong>${text}<br><strong>With: </strong>${subs}</div>`
            }
        }
        return ""
    }

}

export default class CellpackI18n extends Cellpack {

    private i18n: any
    // own config - TODO: own structure?
    private debug: boolean
    // defaultLocale: string

    init(): Promise<void> {
        // own config
        this.config = this.environment.get("cellpacks")["cellpack-i18n"]
        // debug
        if(this.config.debug !== undefined) this.debug = this.config.debug
        else this.config = this.environment.get('debug',false)

        return Promise.resolve()
    }

    // translations(text: string, subs?: any): string {
    //     if(this.debug) this.transmitter.emit("log.cellpack.i18n",`Translation of: "${text}" with: ${subs}`)
    //     try {
    //         return this.i18n.__(text,subs)
    //     } catch(err){
    //         this.transmitter.emit("log.cellpack.i18n",`Translation Error: "${err}" in: ${text} with: ${subs}`)
    //         if(this.debug){
    //             return `<div class="microb-error" style="color:red; background-color:#fee; border:solid 1px #f00; border-radius:3px; padding:10px; font-size:1em; font-family:Monospace"><strong>Translation error: </strong>${err}<br><strong>In: </strong>${text}<br><strong>With: </strong>${subs}</div>`
    //         }
    //     }
    //     return ""
    // }

    setLocale(connection: Connection, locale: string): void {
        let i18n: any = {}
        I18n.configure({
            defaultLocale: this.config.defaultLocale || "en",
            register: i18n,
            directory: `${appRoot}/translations`
        })
        i18n.setLocale(locale)

        if(this.debug) this.transmitter.emit("log.cellpack.i18n",`Set Locale: ${i18n.getLocale()}`)

        // let translator: Translator = {
        //     trans: this.translations,
        //     i18n: i18n
        // }

        connection.environment.set("cellpack.i18n",new Translator(i18n,this))
        // return new Translator(i18n,this)
        // return translator
    }

    getEnvironment(): Environment {
        return this.environment
    }

    getTransmitter(): Transmitter {
        return this.transmitter
    }

    request(connection: Connection): Promise<boolean> {
        let i18nObject = connection.environment.get("cellpack.i18n")
        if(i18nObject !== undefined){
            connection.environment.add("template.filters", {
                name: "trans",
                // env: "cellpack.i18n",
                class: connection.environment.get("cellpack.i18n"),
                func: connection.environment.get("cellpack.i18n").translations
            })
        }


    //     let i18n: any = {}
    //     I18n.configure({
    //         defaultLocale: this.config.defaultLocale || "en",
    //         register: i18n,
    //         directory: `${appRoot}/translations`
    //     })
    //
    //     if(connection.request.attributes.has("locale")) i18n.setLocale(connection.request.attributes.get("locale"))
    //     if(connection.environment.has("cellpack.i18n.locale")) i18n.setLocale(connection.environment.get("cellpack.i18n.locale"))
    //     if(this.debug) this.transmitter.emit("log.cellpack.i18n",`Set Locale: ${i18n.getLocale()}`)
    //
    //     this.environment.add("template.filters", {
    //         name: "trans",
    //         class: this,
    //         func: this.translations
    //     })
    //
    //     connection.environment.set("cellpack.i18n",i18n)
    //
        return Promise.resolve(true)
    }
}
