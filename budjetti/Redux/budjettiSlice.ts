import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SQLite from 'expo-sqlite';

export const luoTaulut = createAsyncThunk("budjetit/luoTaulut", async () => {

    const db : SQLite.SQLiteDatabase = SQLite.openDatabase("budjettikanta.db");

    // Asetetaan foreign_key päälle, jotta CASCADE poisto onnistuu
    db.exec(
    [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], 
    false, 
    () =>   console.log('Foreign keys turned on') 
    )

    // Luodaan taulut
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
      luokkaId INTEGER,
      arvio REAL,
      toteuma REAL,
      FOREIGN KEY (budjetitId) REFERENCES budjetit(id) ON DELETE CASCADE,
      FOREIGN KEY (luokkaId) REFERENCES luokat(id)
    )`)

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
      ("Sähkö",2,3,150,240.80),
      ("Hesburger",2,2,20,14.30)
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
    }),
    (err : SQLite.SQLError) => {
        console.log(err);
    },
    () => {
        console.log("Taulut luotiin onnistuneesti!")
    }
    }) ;

    export const budjettiSlice = createSlice({

        name : 'budjetit',
        initialState : {
            db : [],
            budjetit : [],
            luokat : [],
            budjetti : []
        } as State,
        reducers : {

        },
        extraReducers : (builder : any) => {
            builder.addCase(luoTaulut.fulfilled, (state : State, action : PayloadAction) => {

            })
        }
    })

    export const {  } = budjettiSlice.actions;
    export default budjettiSlice.reducer;





