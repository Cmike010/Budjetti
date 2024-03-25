import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';

const db : SQLite.SQLiteDatabase = SQLite.openDatabase("budjettikanta.db");

// Asetetaan foreign_key päälle, jotta CASCADE poisto onnistuu
db.exec(
  [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], 
  false, 
  () =>   console.log('Foreign keys turned on') 
)

db.transaction(
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

    tx.executeSql(`INSERT INTO budjetit (nimi)
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
      `)
    
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
  },
  (err : SQLite.SQLError) => {
    console.log(err);
  },
  () => {
    console.log("Taulut luotiin onnistuneesti!")
  }
)

const App : React.FC = () : React.ReactElement => {
  return (
    <SafeAreaProvider>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
