const express =require('express')
const cors =require('cors');
const  cookieParser =require ('cookie-parser')
const { config } =require ('dotenv')
const morgan =require ('morgan');
const userRoutes=require ('./routes/userRoutes.js')
const courseRoutes=require ('./routes/courseRoutes.js')
const paymentRoutes =require ('./routes/paymentRoutes.js')
const lecturesRoutes=require('./routes/LectureRoutes.js')
const mcqRoutes=require('./routes/mcqRoutes.js')
const commentRoutes=require('./routes/commentRoutes.js')
//const miscellaneousRoutes=require('./routes/miscellaneousRoutes.js')
const errorMiddleware =require('./middlewares/errorMiddleware.js');

const miscRoutes =require ('./routes/miscellaneousRoutes.js')

config()
const app=express()


app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}))

app.use(cookieParser());

app.use(morgan('dev'))


app.use('/ping',(req,res)=>{
    res.send('/pong')

})

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/lectures',lecturesRoutes)
app.use('/api/v1/payments',paymentRoutes)
app.use('/api/v1/mcqs',mcqRoutes)
app.use('/api/v1/comments',commentRoutes)

app.use('/api/v1/',miscRoutes)


app.all('*',(req,res)=>{
    res.status(404).send('opps!! page not found')
})

app.use(errorMiddleware)

module.exports=app;






