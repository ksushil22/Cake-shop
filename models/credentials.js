const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cakeshop',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("connected to database"))
.catch(err=> console.log(err.message));
const Joi = require('joi');
const credentialsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    email:{
        type: String,
        required: true,

    },
    username: {
        type: String,
        required: true,
        minlength:3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});
const credential = mongoose.model('credential', credentialsSchema);

function validate(credentials){
    const Schema=Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().required(),
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    })
    return Schema.validate(credentials);
}

exports.credential = credential;
exports.credentialsSchema = credentialsSchema;
exports.validateCredential = validate;