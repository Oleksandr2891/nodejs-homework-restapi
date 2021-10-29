const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const ContactSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

ContactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
