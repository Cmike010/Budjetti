interface State {
    budjetit : any
    luokat : any
    budjetti : any
    luokanPoistoDialog : boolean
    budjetinPoistoDialog : boolean
}

interface BudjetitPayload {
    budjetit : {id : number, nimi : string}[];
    luokat : any[];
    budjetti : any[];
}[]