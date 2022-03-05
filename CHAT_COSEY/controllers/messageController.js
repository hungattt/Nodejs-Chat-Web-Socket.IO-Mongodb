const mongoose = require("mongoose");
const Message = mongoose.model("Message");
var chuyenthanhObjectId=require('mongodb').ObjectId;


exports.getMessage = async (req, res) => {
    var idchat = chuyenthanhObjectId(req.params.idcanxoa);
    const messages = await Message.find({

        idchat
    });
  
    res.json(messages);
  };