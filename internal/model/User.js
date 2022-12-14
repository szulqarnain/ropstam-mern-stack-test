const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type:String,
        required:[true, 'Please enter your name']
    },
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        index: { unique: true },
        lowercase:true,
        validate:[isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required:[true,'Please enter a password'],
        minlength:[6,'Minimum password lenght is 6 characters']
    },



}, { timestamps: true });


// Mongoose hooks functions
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

//Static Method to login user
userSchema.statics.login = async function(email,password){
    
    const user = await this.findOne({email})
  
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}




const User =   mongoose.model(`User`, userSchema);
module.exports = {userSchema, User};
