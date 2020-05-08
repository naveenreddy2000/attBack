const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailSchema = new Schema({
    email : {
        type : String
    },
    subjects : [
        {
            subject : {
                type : String
            },
            minPer : {
                type : Number
            },
            clsAtt : {
                type : Number
            },
            totCls : {
                type : Number
            }
        }
    ]
})

module.exports = Owner = mongoose.model('detail',DetailSchema);