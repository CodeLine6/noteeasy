const mongoose = require('mongoose');
const {Schema} = mongoose;
const notesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title : {
        type : String,
    },
    description : {
        type: Object,
    },
    tag : [{
        type: String
    }],
    pinned : {
        type : Boolean,
        default : false 
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    date : {
        type: Date,
        default : Date.now
    }

});

module.exports = mongoose.model('notes',notesSchema);