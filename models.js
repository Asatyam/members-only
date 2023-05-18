const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {type: String,required:true,minLength:4},
    password: {type: String,requird:true},
});

const MessageSchema = new Schema({
    title: {type:String, required:true,},
    date: {type: Date, default: new Date()},
    content: {type: String, required:true},
    author: {type: Schema.Types.ObjectId, ref:"User",required:true},
});

exports.mongoose.model('User', UserSchema);
exports.mongoose.model('Message', MessageSchema);