const express = require('express');
const app = express();
const  mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors')
const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const tagRoutes = require('./routes/tag')
const formRoutes = require('./routes/form')

require('dotenv').config()
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify:false,useCreateIndex:true})
.then(()=>console.log("db connected"))
.catch((err)=>{
    console.log(err.message)
})
if(process.env.NODE_ENV='dev'){
    app.use(cors({origin:`${process.env.CLIENT_URL}`}))
}


app.use(bodyParser.json())

app.use(morgan('dev'))

app.use('/api',blogRoutes
)
app.use('/api',authRoutes
)
app.use('/api',userRoutes
)
app.use('/api',categoryRoutes
)
app.use('/api',tagRoutes
)
app.use('/api',formRoutes
)
// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//       res.status(401).json({error:"please login"});
//     }
//   });
const port = process.env.PORT||8000;
app.listen(port,()=>{console.log(`server started on port:${port}`)})