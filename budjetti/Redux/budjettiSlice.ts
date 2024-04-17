import { createAsyncThunk, createSlice, PayloadAction, AsyncThunkAction } from "@reduxjs/toolkit";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";


const db = SQLite.openDatabase('budjettikanta.db');

db.exec(
    [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }],
    false,
    () => {
        console.log('Foreign keys turned on');
    }
);

/*db.transaction(
    (tx : SQLite.SQLTransaction) => {
tx.executeSql(`
    DROP TABLE IF EXISTS budjetit
    `)
    tx.executeSql(`
    DROP TABLE IF EXISTS luokat
    `)
    tx.executeSql(`
    DROP TABLE IF EXISTS budjetti
    `)
})*/

/*db.transaction(
    (tx : SQLite.SQLTransaction) => {
        tx.executeSql(`INSERT INTO budjetit (nimi)
    VALUES
      ("Eka Budjetti"),
      ("Toka Budjetti"),
      ("Kolmas Budjetti")
      `)
        
    tx.executeSql(`INSERT INTO luokat (nimi)
    VALUES
      ("Ei valittu"),
      ("Ruoka"),
      ("Asumiskulut"),
      ("Auto") 
      `)
    tx.executeSql(`INSERT INTO budjetti (nimi, budjetitId, luokkaId, arvio, toteuma)
    VALUES
      ("Maito", 1, 1, 20.50, 10),
      ("Vuokra", 1, 3, 850, 840),
      ("Bensa", 2, 1, 260, 220.80),
      ("Renkaat",3,4,700,650),
      ("Sähkö",2,3,150,240.80),
      ("Hesburger",2,2,20,14.30)
      `)
    },
    (tx : SQLite.SQLError) => {
        console.log(tx)
    },
    () => console.log("SUCCESS")
)*/

export const luoTaulut = createAsyncThunk("budjetit/luoTaulut", async() => {

    //const db = await avaaYhteys();
    
    // Luodaan taulut
    return new Promise<void>((resolve, reject) => {
    db.transaction(

        
        (tx : SQLite.SQLTransaction) => {

    tx.executeSql(`
    CREATE TABLE IF NOT EXISTS budjetit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi TEXT
    );`),
    (err : SQLite.SQLError) => {
        reject(err)
    }

    tx.executeSql(`CREATE TABLE IF NOT EXISTS luokat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi TEXT
    )`),
    (err : SQLite.SQLError) => {
        reject(err)
    }

    tx.executeSql(`CREATE TABLE IF NOT EXISTS budjetti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi TEXT,
      budjetitId INTEGER,
      luokkaId INTEGER DEFAULT 1 NOT NULL,
      arvio REAL,
      toteuma REAL,
      FOREIGN KEY (budjetitId) REFERENCES budjetit(id) ON DELETE CASCADE,
      FOREIGN KEY (luokkaId) REFERENCES luokat(id)
    )`),
    (err : SQLite.SQLError) => {
        console.error(err);
        reject(err)
    }
    },
    (err : SQLite.SQLError) => {
        console.log("Virhe: " + err);
    },
    () => {
        console.log("Taulut luotiin onnistuneesti!")
        resolve();
        //suljeYhteys(db);
    }
    )})});

    export const haeTaulut = createAsyncThunk("budjetit/haeTaulut", async () => {

        let taulut : any = [];

        try {
            
            const promise1 = new Promise<void>((resolve, reject) => { db.transaction(
                (tx : SQLite.SQLTransaction) => {
                    tx.executeSql(`SELECT * FROM budjetit`, [],
                    (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                        taulut = [...taulut, rs.rows._array];
                        resolve()
                    },
                    
                    (_tx : SQLite.SQLTransaction, error : SQLite.SQLError) => {
                        console.error('Virhe SQL-lausekkeen suorituksessa:', error);
                        reject(error);
                        return true // Keskeytä transaktio virheen sattuessa
                    });
                },

                
                (_error) => {
                    console.error('Virhe transaktiossa:', _error);
                }
            )});

            const promise2 = new Promise<void>((resolve, reject) => { db.transaction(
                (tx : SQLite.SQLTransaction) => {
                    tx.executeSql(`SELECT * FROM luokat`, [],
                    (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                        taulut = [...taulut, rs.rows._array];
                        resolve();
                    },
                    
                    (_tx : SQLite.SQLTransaction, error : SQLite.SQLError) => {
                        console.error('Virhe SQL-lausekkeen suorituksessa:', error);
                        reject(error)
                        return true; // Keskeytä transaktio virheen sattuessa
                    });
                },

                
                (_error) => {
                    console.error('Virhe transaktiossa:', _error);
                }
            )});

            const promise3 = new Promise<void>((resolve, reject) => {db.transaction(
                    (tx : SQLite.SQLTransaction) => {
                        tx.executeSql(`SELECT * FROM budjetti`, [],
                        (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                            taulut = [...taulut, rs.rows._array];
                            resolve()
                        },
                        
                        (_tx : SQLite.SQLTransaction, error : SQLite.SQLError) => {
                            console.error('Virhe SQL-lausekkeen suorituksessa:', error);
                            reject(error);
                            return true; // Keskeytä transaktio virheen sattuessa
                        });
                    },

                    
                    (_error) => {
                        console.error('Virhe transaktiossa:', _error);
                    }
                )});
            
            await Promise.all([promise1, promise2, promise3])
                console.log("Taulut haettu onnistuneesti!");
                console.log(taulut)
                return taulut;
            
    
            
        } catch (error) {
            console.error('Virhe taulujen hakemisessa:', error);
            throw error;
        }
    })


    export const tallennaBudjettiRivi = createAsyncThunk(
        "budjetit/tallennaBudjettiRivi",
        async (payload : any) => {
          console.log("Slicesta päivää: " + JSON.stringify(payload));
        
        try {
            await new Promise((resolve,reject) => { db.transaction(
                (tx : SQLite.SQLTransaction) => {
                    tx.executeSql(`
                    INSERT INTO budjetti (nimi, budjetitId, luokkaId, arvio, toteuma) VALUES (?, ?, ?, ?, ?)
                    `,
                    [payload.nimi, payload.budjettiId, Number(payload.luokkaId.id), payload.arvio, payload.toteuma]
                )
                },
                (err : SQLite.SQLError) => {console.log("KISSA " + err); reject(err)},
                () => {console.log("LISÄTTY"); resolve}
            )
            })
        } catch (e){ console.log(e); throw e}
    });

    export const lisaaLuokka = createAsyncThunk(
        "budjetit/lisaaLuokka",
        async (payload : any) => {
            console.log("Slicestä iltaa: " +JSON.stringify(payload));

            try {
                await new Promise((resolve, reject) => {db.transaction(
                    (tx : SQLite.SQLTransaction) => {
                        tx.executeSql(`
                        INSERT INTO luokat (nimi) VALUES (?)
                        `,
                    [payload]
                    )
                    },
                    (err : SQLite.SQLError) => {console.log(err); reject(err)},
                    (() => {console.log("Luokka lisätty onnistuneesti!")})
                )})
            } catch (e) { console.log(e); throw e}
        }
    )

    export const poistaLuokka = createAsyncThunk(
        "budjetit/poistaLuokka",
        
        async (payload : number) => {

            try {
                await new Promise((resolve, reject) => {
                    db.transaction(
                    (tx : SQLite.SQLTransaction) => {
                        tx.executeSql(`
                        UPDATE budjetti
                        SET luokkaId = 1
                        WHERE luokkaId = (?)
                        `,[payload],
                    (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                        console.log("PÄIVITYS ONNISTUI! " + console.log(rs.rows._array))
                    }
                    );

                        tx.executeSql(`
                        DELETE FROM luokat
                        WHERE id = (?)
                        `,
                        [payload],
                        (_tx: SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {

                            console.log("Luokka poistettu onnistuneesti.");
                            haeTaulut();
                            resolve("ONNISTUI")
                        }
                    )
                    },
                    (err : SQLite.SQLError) => {
                        console.log("Päivitys ei onnistunut: " + err)
                        reject();
                    }
                )})
            } catch (e) {console.log(e)}
        }
    )

    /*export const poistaLuokka = createAsyncThunk(
        "budjetit/poistaLuokka",
        async (luokkaId: number) => {
            console.log("Luokan poisto id:lle " + luokkaId);
    
            try {
                await new Promise((resolve, reject) => {
                    db.transaction(
                        (tx: SQLite.SQLTransaction) => {
                            // Päivitä budjetti-taulun rivit, joissa luokkaId vastaa parametrina saatuun id:hen
                            tx.executeSql(
                                `
                                UPDATE budjetti 
                                SET luokkaId = 1 
                                WHERE luokkaId = (?)
                                `,
                                [luokkaId],
                                (_tx: SQLite.SQLTransaction, _rs: SQLite.SQLResultSet) => {
                                    // Päivitys onnistui, jatketaan
                                    console.log("Budjetti-taulun rivit päivitetty onnistuneesti.");
                                }
                            );
    
                            // Poista luokka luokat-taulusta
                            tx.executeSql(
                                `
                                DELETE FROM luokat 
                                WHERE id = (?)
                                `,
                                [luokkaId],
                                (_tx: SQLite.SQLTransaction, _rs: SQLite.SQLResultSet) => {
                                    // Poisto onnistui, ratkaistaan promise
                                    console.log("Luokka poistettu onnistuneesti.");
                                    resolve("ONNISTUI");
                                }
                            );
                        }
                    );
                });
            } catch (error) {
                // Yleinen virheenkäsittely, tulostetaan virhe
                console.error("Virhe suorittaessa transaktiota:", error);
                throw error;
            }
        }
    );*/
    
   /*export const haeTaulut = createAsyncThunk("budjetit/haeTaulut", async () => {
    
    //const db = await avaaYhteys();
    const taulut : any = []

    const budjetit : any = [], luokat : any  = [], budjetti : any = []
    let myPromise = new Promise((myResolve, myReject) => { db.transaction(
        (tx : SQLite.SQLTransaction) => {
            tx.executeSql(`SELECT * FROM budjetit`, [],
            (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                budjetit.push(rs.rows._array);
            })

            tx.executeSql(`SELECT * FROM luokat`, [],
            (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                luokat.push(rs.rows._array);
            })

            tx.executeSql(`SELECT * FROM budjetti`, [],
            (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
                budjetti.push(rs.rows._array);
            })
        },
        (err : SQLite.SQLError) => {
            console.log("Virhe: " + err);
            },
            () => {
            myResolve(console.log("ok"));
        }
    )})
    myPromise.then(() => {
        
        taulut.push(budjetit, luokat, budjetti)
        console.log("Tässä taulut: " + JSON.stringify(taulut));
        //suljeYhteys(db);
    })
   }) */

    export const budjettiSlice = createSlice({

        name : 'budjetit',
        initialState : {
            budjetit : [],
            luokat : [],
            budjetti : [],
            luokanPoistoDialog : false
        } as State,
        reducers : {
            luokanPoistoDialog : (state : State, action : PayloadAction<boolean>) => {
                state.luokanPoistoDialog = action.payload;
                console.log(state.luokanPoistoDialog)
            }
        },
        extraReducers : (builder : any) => {
            builder.addCase(luoTaulut.fulfilled, (state : State, action : PayloadAction) => {
                console.log("Taulut luotu fulfilled")
            }).addCase(haeTaulut.fulfilled, (state : State, action : PayloadAction<BudjetitPayload[]>) => {
                console.log("Taulut haettu fulfilled")
                state.budjetit = action.payload[0];
                state.luokat = action.payload[1];
                state.budjetti = action.payload[2];
                console.log("State asetettu")
                console.log("Tila: " + JSON.stringify(state))
            }).addCase(tallennaBudjettiRivi.fulfilled, (state : State, action : PayloadAction<any>) => {
                console.log(state.budjetti);
            }).addCase(lisaaLuokka.fulfilled, (state : State, action : PayloadAction) => {
                state.luokat = {...state.luokat, luokat : action.payload}
                console.log(state.luokat);
            }).addCase(poistaLuokka.fulfilled, (state : State, action : PayloadAction) => {
                console.log(state.luokat)
            })
        }
    });

    export const { luokanPoistoDialog } = budjettiSlice.actions;
    export default budjettiSlice.reducer;



    // Poista taulut
    /*tx.executeSql(`
    DROP TABLE IF EXISTS budjetit
    `)
    tx.executeSql(`
    DROP TABLE IF EXISTS luokat
    `)
    tx.executeSql(`
    DROP TABLE IF EXISTS budjetti
    `)*/

    

    // Esimerkkidataa tauluihin
    /*tx.executeSql(`INSERT INTO budjetit (nimi)
    VALUES
      ("Eka Budjetti"),
      ("Toka Budjetti"),
      ("Kolmas Budjetti")
      `)

    tx.executeSql(`INSERT INTO luokat (nimi)
    VALUES
      ("Ruoka"),
      ("Asumiskulut"),
      ("Auto")
      `)
    tx.executeSql(`INSERT INTO budjetti (nimi, budjetitId, luokkaId, arvio, toteuma)
    VALUES
      ("Maito", 1, 1, 20.50, 10),
      ("Vuokra", 1, 2, 850, 840),
      ("Bensa", 2, 3, 260, 220.80),
      ("Renkaat",3,3,700,650),
      ("Sähkö",2,2,150,240.80),
      ("Hesburger",2,1,20,14.30)
      `)*/
    
    // Tulostaa taulujen sisällöt  
    /*tx.executeSql(`SELECT * FROM budjetit`, [],
    (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
      console.log(rs.rows._array);
    })
    tx.executeSql(`SELECT * FROM luokat`, [],
    (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
      console.log(rs.rows._array);
    })
    tx.executeSql(`SELECT * FROM budjetti`, [],
    (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
      console.log(rs.rows._array);
    })*/