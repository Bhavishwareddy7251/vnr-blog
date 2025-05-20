const exp = require('express');
const app = exp();
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const cors = require('cors')
app.use(cors())

const adminApp = require('./APIS/adminApi');
const userApp = require('./APIS/userApi');
const authorApp = require('./APIS/authorApi');

const port = 3003;

mongoose.connect("mongodb://localhost:27017/vnrblog")
.then(() => {
    console.log("DB connected Successfully");
    app.listen(port, () => console.log(`Server running on port ${port}`));
})
.catch((e) => console.log("Error in connecting to DB: ", e));

// body parser
app.use(exp.json())

app.use('/user-api', userApp);
app.use('/author-api', authorApp);
app.use('/admin-api', adminApp);

// error handler
app.use((err,req,res,next)=>{
    console.log("some error is occured: ",err);
    res.send({message:err.message});
})