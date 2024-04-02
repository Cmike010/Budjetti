interface State {
    budjetit : any,
    luokat : any,
    budjetti : any
}

interface BudjetitPayload {
    budjetit : {id : number, nimi : string}[];
    luokat : any[];
    budjetti : any[]
}[]