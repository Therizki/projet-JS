const express = require('express')
const app = express()
const mariaDb = require('mariadb')
const path = require('path'); 
const bodyParser = require('body-parser')
const PORT = 3000
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => res.sendFile(path.resolve(__dirname, "public", "index.html")));

//add ejs///
//app.set('view engine', 'ejs');

///////////////////////////////////

const pool = mariaDb.createPool({
    host:'localhost',
    user: 'root',
    password: 'ayoub',
    database: 'nodedb',
    connectionLimit: 5
});

const dataBase = async function () {
    let conn;
    let sql ; 
    try {
    conn = await pool.getConnection();
    console.log('connextion avec db faite');
    } catch (err) {
      console.log(err)
    }
  }()
const router = express.Router()
router.route('/')
    .get( async function(req,res){
        try{
        const rows = await pool.query("SELECT * FROM nodedb.events1")
        res.send(rows)
       //res.send(rows);
        }catch(err){
            res.send(err);
        }
      }
    )
    .post( async function(req,res){
       try{
       const{name ,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition } = req.body;
       const requstSql = "Select * FROM `nodedb`.`events1` WHERE  `name`= ? AND `lieu`= ? AND `nombreMaximal`=? AND `Delai`=? AND `DateEvent`=? AND `heurDepart`=? AND `heurFinition`=?";
       let rows = await pool.query(requstSql,[name,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition]) 
       const requstSql2 = "Select * FROM `nodedb`.`events1` WHERE `lieu`= ? AND  `DateEvent`=? AND `heurDepart`=? AND `heurFinition`=?";    
       let rowsExi = await pool.query(requstSql2,[lieu,  DateEvent ,   heurDepart ,   heurFinition]) 
       if(Object.keys(rows).length==1 && Object.keys(rowsExi).length ==1){ 
        console.log("je suis ici")
        let sqlRequet = "INSERT INTO nodedb.events1  VALUES (?,?,?,?,?,?,?)";
         await pool.query(sqlRequet,[name,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition]);
         res.send()
       }
       }catch(err){
        res.send(err);
       }
    })
    .delete(async function(req,res){
        try{
            const{name ,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition } = req.body;
            let sqlRequet = "DELETE FROM `nodedb`.`events1` WHERE  `name`= ? AND `lieu`= ? AND `nombreMaximal`=? AND `Delai`=? AND `DateEvent`=? AND `heurDepart`=? AND `heurFinition`=?";
            await pool.query(sqlRequet,[name,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition]);
            const rows = await pool.query("SELECT * FROM nodedb.events1")
            res.send(rows);
            }catch(err){
             res.send(err);
            }
    })
// router.route('/:modif')
//     .post( async function(req,res){
//         console.log("je suis ic")
//     const{name ,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition } = req.body;
//     const requstSql = "Select * FROM `nodedb`.`events1` WHERE  `name`= ? AND `lieu`= ? AND `nombreMaximal`=? AND `Delai`=? AND `DateEvent`=? AND `heurDepart`=? AND `heurFinition`=?";
//     let rows = await pool.query(requstSql,[name,lieu ,nombreMaximal , Delai ,  DateEvent ,   heurDepart ,   heurFinition]) 
//     if(Object.keys(rows).length==1){        
//         let sqlRequet = "UPDATE nodedb.events1 SET ? WHERE id = ? "
//      //  " UPDATE table_name,SET column1 = value1, column2 = value2, ...WHERE condition; "
//         var param=[req.body,req.query]
//          await pool.query(sqlRequet,param);
//          res.send("Done");
//        }else{
//         res.send("je ne peux pas modifee parce que l'evenement est deja present");
//        }
//     })
//     .get(async function(req,res){
//       await pool.query("Select * FROM nodedb.events1 WHERE id=? ",req.query.id,function(err,rs){
//         res.send("bon");
//       })
//     })
app.use('/api',router)

// app.get('/',(req,res)=>{
//     res.send('hello world!')
// })

app.listen(PORT,()=>
{
    console.log(`serveur demaree : http://localhost:${PORT} `)
} )
