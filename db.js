var mongoose = require("mongoose");

var dotEnv = require("dotenv");
dotEnv.load();

mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/sampleApp');
// mongoose.connect(process.env.DB_URL,{ useNewUrlParser:true });

//Create userschema & models
var userSchema=mongoose.Schema({
    name: {
            type: String,
            required: true
         },
    email: {
        type:String,
        unique: true
    },
     password: {
         type: String,
         required: true
     },
     confirmPassword: {
         type: String,
         required: true
     }
})

exports.userDetails = mongoose.model("userDetails",userSchema,"userdetail");