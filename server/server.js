
const app=require("./app.js")
const connectToDB =require("./config/dbConnection.js")
const cloudnary =require("cloudinary")
const Razorpay=require("razorpay")
const PORT=process.env.PORT||5000
//cloudnery cofiguration
cloudnary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

   const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET,
})


app.listen(PORT,async ()=>{

     await connectToDB()

    console.log(`app is running at http:localhost ${PORT}`)

})
module.exports=razorpay

