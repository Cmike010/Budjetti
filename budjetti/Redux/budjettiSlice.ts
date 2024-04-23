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


////////////////////////// TAULUJEN POISTOA VARTEN //////////////////////

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

/////////////////////// TESTIDATAA TAULUIHIN ////////////////////////

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

    // Luodaan taulut
    return new Promise<void>((resolve, reject) => {
    db.transaction(

        
        (tx : SQLite.SQLTransaction) => {

    tx.executeSql(`
    CREATE TABLE IF NOT EXISTS budjetit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi TEXT
    );`)

    tx.executeSql(`CREATE TABLE IF NOT EXISTS luokat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi TEXT
    )`)

    tx.executeSql(`CREATE TABLE IF NOT EXISTS budjetti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nimi TEXT,
      budjetitId INTEGER,
      luokkaId INTEGER DEFAULT 1 NOT NULL,
      arvio REAL,
      toteuma REAL,
      FOREIGN KEY (budjetitId) REFERENCES budjetit(id) ON DELETE CASCADE,
      FOREIGN KEY (luokkaId) REFERENCES luokat(id)
    )`)

    tx.executeSql(`
    INSERT INTO luokat (nimi)
    SELECT * FROM (SELECT "Ei valittu") AS tmp
    WHERE NOT EXISTS (
        SELECT nimi FROM luokat WHERE nimi = "Ei valittu"
    )
    `);
    },
    (err : SQLite.SQLError) => {
        console.log("Virhe: " + err);
        reject();
    },
    () => {
        console.log("Taulut luotiin onnistuneesti!")
        resolve();
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
                        return true 
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
                        return true; 
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
                            return true; 
                        });
                    },
                    (_error) => {
                        console.error('Virhe transaktiossa:', _error);
                    }
                )});
            
            await Promise.all([promise1, promise2, promise3])
                console.log("Taulut haettu onnistuneesti!");
                return taulut;
            
        } catch (error) {
            console.error('Virhe taulujen hakemisessa:', error);
            throw error;
        }
    })


    export const tallennaBudjettiRivi = createAsyncThunk(
        "budjetit/tallennaBudjettiRivi",
        async (payload : any) => {
        
        try {
            await new Promise((resolve,reject) => { db.transaction(
                (tx : SQLite.SQLTransaction) => {
                    tx.executeSql(`
                    INSERT INTO budjetti (nimi, budjetitId, luokkaId, arvio, toteuma) VALUES (?, ?, ?, ?, ?)
                    `,
                    [payload.nimi, payload.budjettiId, Number(payload.luokkaId.id), payload.arvio, payload.toteuma]
                )
                },
                (err : SQLite.SQLError) => {console.log(err); reject(err)},
                () => {console.log("LISÄTTY"); resolve}
            )
            })
        } catch (e){ console.log(e); throw e}
    });

    export const lisaaLuokka = createAsyncThunk(
        "budjetit/lisaaLuokka",
        async (payload : string) => {

            try {
                await new Promise<void>((resolve, reject) => {db.transaction(
                    (tx : SQLite.SQLTransaction) => {
                        tx.executeSql(`
                        INSERT INTO luokat (nimi) VALUES (?)
                        `,
                    [payload]
                    )
                    },
                    (err : SQLite.SQLError) => {console.log(err); reject(err)},
                    (() => {console.log("Luokka lisätty onnistuneesti!"); resolve(); })
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
                    () => {
                        console.log("PÄIVITYS ONNISTUI! ")
                    }
                    );

                        tx.executeSql(`
                        DELETE FROM luokat
                        WHERE id = (?)
                        `,
                        [payload],
                        () => {

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

    export const lisaaBudjetti = createAsyncThunk(
        "budjetit/lisaaBudjetti",
        
        async (payload : string) => {

            try {
                await new Promise((resolve, reject) => {

                    db.transaction(
                        (tx : SQLite.SQLTransaction) => {
                            tx.executeSql(`
                            INSERT INTO budjetit (nimi) VALUES (?)
                            `,
                            [payload]
                        )
                        },
                        (err : SQLite.SQLError) => {console.log(err); reject(err)},
                        () => { console.log("Budjetti lisätty onnistuneesti."); resolve("OK");}
                    )
                })
            } catch (e) { console.log(e);}
        }
    )

    export const poistaBudjetti = createAsyncThunk(
        "budjetit/poistaBudjetti",
        async (payload : number) => {

            try {
                await new Promise((resolve, reject) => {
                    db.transaction(
                        (tx : SQLite.SQLTransaction) => {
                            tx.executeSql(`
                            DELETE FROM budjetit
                            WHERE id = (?)
                            `, [payload],
                        () => {
                            console.log("Budjetti poistettu onnistuneesti");
                            resolve("OK");
                        }),
                        (err : SQLite.SQLError) => {
                            console.log("Budjetin poisto ei onnistunut " + err);
                            reject();
                        }
                        }
                    )
                })
            }
            catch (e) {console.log(e)}
        }
    )

    export const paivitaBudjettiRivi = createAsyncThunk(
        "budjetit/paivitaBudjettiRivi",

        async (payload : any) => {
            try {

                await new Promise((resolve, reject) => {

                    db.transaction(
                        (tx : SQLite.SQLTransaction) => {
                            tx.executeSql(`
                            
                            UPDATE budjetti
                            SET nimi = (?), luokkaId = (?), arvio = (?), toteuma = (?)
                            WHERE id = (?)
                            `,[payload.nimi, payload.luokkaId, payload.arvio, payload.toteuma, payload.id],() => {
                                console.log("Päivitys onnistui!")
                                resolve("Onnistui");
                            })
                        },
                        (err : SQLite.SQLError) => {
                            console.log("Päivitys ei onnistunut: " + err)
                            reject();
                        }
                    )
                })
            }
            catch (e) {console.log(e)}
        }
    )

    export const poistaBudjettiRivi = createAsyncThunk(
        "budjetit/poistaBudjettiRivi",

        async (payload : number) => {

            try {
                await new Promise((resolve, reject) => {

                    db.transaction(
                        (tx : SQLite.SQLTransaction) => {
                            tx.executeSql(`
                            DELETE FROM budjetti
                            WHERE id = (?)
                            `,
                        [payload],
                        () => {console.log("Budjettirivi poistettu onnistuneesti!"); resolve("OK")}
                        )
                        },
                        (err : SQLite.SQLError) => {
                            console.log("Rivin poisto epäonnistui " + err);
                            reject();
                        }
                    )
                })
            }
            catch (e) {console.log("Virhe " + e)}
        }
    )

    export const vaihdaLuokanNimi = createAsyncThunk(
        'budjetit/vaihdaLuokanNimi',
        async (payload : Luokka) => {

            await new Promise((resolve, reject) => {
                db.transaction(
                    (tx : SQLite.SQLTransaction) => {
                        tx.executeSql(`
                        UPDATE luokat
                        SET NIMI = (?)
                        WHERE id = (?)
                        `, [payload.nimi, payload.id],
                    () => {
                        console.log("Luokan päivitys onnistui!");
                        resolve("OK")
                    }
                    ),
                    (err : SQLite.SQLError) => {
                        console.log("Luokan päivitys ei onnistunut" + err)
                        reject(err);
                    }
                    }
                )
            })
        }
    )

    export const budjettiSlice = createSlice({

        name : 'budjetit',
        initialState : {
            budjetit : [],
            luokat : [],
            budjetti : [],
            luokanPoistoDialog : false,
            budjetinPoistoDialog : false,
            budjettiRivinPoistoDialog : false,
            asetuksetDialog : false
        } as State,
        reducers : {
            luokanPoistoDialog : (state : State, action : PayloadAction<boolean>) => {
                state.luokanPoistoDialog = action.payload;
            },
            budjetinPoistoDialog : (state : State, action : PayloadAction<boolean>) => {
                state.budjetinPoistoDialog = action.payload;
            },
            budjettiRivinPoistoDialog : (state : State, action : PayloadAction<boolean>) => {
                state.budjettiRivinPoistoDialog = action.payload;
            },asetuksetDialog : (state : State, action : PayloadAction<boolean>) => {
                state.asetuksetDialog = action.payload;
            } 
        },
        extraReducers : (builder : any) => {
            builder.addCase(luoTaulut.fulfilled, () => {
                console.log("Taulut luotu fulfilled")
            }).addCase(haeTaulut.fulfilled, (state : State, action : PayloadAction<[Budjetit[],Luokka[],Budjetti[]]>) => {
                console.log("Taulut haettu fulfilled")
                state.budjetit = action.payload[0];
                state.luokat = action.payload[1];
                state.budjetti = action.payload[2];
            }).addCase(tallennaBudjettiRivi.fulfilled, () => {
                console.log("Rivi tallennettu."); 
            }).addCase(lisaaLuokka.fulfilled, () => {
                console.log("LUOKKA LISÄTTY ");
            }).addCase(poistaLuokka.fulfilled, () => {
                console.log("LUOKKA POISTETTU")
            }).addCase(lisaaBudjetti.fulfilled, () => {
                console.log("BUDJETTI LISÄTTY");
            }).addCase(poistaBudjetti.fulfilled, () => {
                console.log("BUDJETTI POISTETTU")
            }).addCase(paivitaBudjettiRivi.fulfilled, () => {
                console.log("BUDJETTIRIVI PÄIVITETTY!")
            }).addCase(poistaBudjettiRivi.fulfilled, () => {
                console.log("BUDJETTIRIVI POISTETTU!")
            }).addCase(vaihdaLuokanNimi.fulfilled, () => {
                console.log("LUOKAN NIMI VAIHDETTU!");
            })
        }
    });

    export const { luokanPoistoDialog, budjetinPoistoDialog, budjettiRivinPoistoDialog, asetuksetDialog } = budjettiSlice.actions;
    export default budjettiSlice.reducer;
