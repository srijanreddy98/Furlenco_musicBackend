const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    googleId: {
        type: String,
        default: null
    },
    twitterId: {
        type: String,
        default: null
    },
    twitterUserName: {
        type:String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    email: String,
    rollNo: String,
    isAdmin: {
      type: Boolean,
      default: false
    }
});
const playlistSchema = new Schema ({
    userId: String,
    name: String,
    tags: [String],
    songs: [String]
});
var User = mongoose.model('users', userSchema);
var Playlist = mongoose.model('playlist', playlistSchema);
module.exports = { User, Playlist };
