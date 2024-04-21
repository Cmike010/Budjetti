interface State {
    budjetit : any
    luokat : any
    budjetti : any
    luokanPoistoDialog : boolean
    budjetinPoistoDialog : boolean
    budjettiRivinPoistoDialog : boolean
}

interface BudjetitPayload {
    budjetit : {id : number, nimi : string}[];
    luokat : any[];
    budjetti : any[];
}[]

interface Budjetti {
    id : number,
    nimi : string,
    budjettiId : number,
    luokkaId : number,
    arvio : number,
    toteuma : number
}