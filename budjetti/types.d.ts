interface State {
    budjetit : Budjetit[] | []
    luokat : Luokka[] | []
    budjetti : Budjetti[] | []
    luokanPoistoDialog : boolean
    budjetinPoistoDialog : boolean
    budjettiRivinPoistoDialog : boolean
    asetuksetDialog : boolean
}

interface BudjetitPayload {
    budjetit : Budjetti[];
    luokat : Luokka[];
    budjetti : Budjetti[];
}[]

interface Budjetti {
    id : number,
    nimi : string,
    budjettiId : number,
    luokkaId : number | string,
    arvio : number,
    toteuma : number
}

interface Luokka {
    id : number,
    nimi : string
}

interface Budjetit {
    id : number,
    nimi : string
}