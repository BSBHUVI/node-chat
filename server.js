import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import data1 from './dbdata.js'
import Pusher from "pusher";
const app=express()
const port =process.env.PORT|9000
const pusher = new Pusher({
    appId: "1364450",
    key: "7ce1e74809f4f8aa6fc5",
    secret: "9aae3bf3e5e0fb41100b",
    cluster: "ap2",
    useTLS: true
  });
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://bhuvan:bhuvan1234@cluster0.hyupmwk.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const connect=mongoose.connection
connect.once("open",()=>{
    console.log("connected");
    const msgCollection=connect.collection('messagecontents');
const changeStream=msgCollection.watch();
changeStream.on("change",(change)=>{
    console.log('a change occured',change);
    if(change.operationType=="insert"){
        const messageDetails=change.fullDocument;
        pusher.trigger("chat","inserted",{
            user:messageDetails.user,
            message:messageDetails.message,
            Time:messageDetails.Time,
           recieved:messageDetails.recieved,

           
        
        });
         }else{
        console.log('error');
    }
});
})
app.get('/',(req,res)=>{
    res.send("hello");
})
app.get('/messages/sync',(req,res)=>{
    data1.find((err,data)=>{
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    })

})
app.post('/messages/new',(req,res)=>{
    const dbd=req.body
    data1.create(dbd,(err,data)=>{
        if(err){
            res.send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})