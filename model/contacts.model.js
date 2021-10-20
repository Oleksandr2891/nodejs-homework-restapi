// const uuid = require("uuid");
const mongoose = require("mongoose");
// const fs = require("fs/promises");
// const contacts = require("./contacts.json");

const { Schema } = mongoose;

const ContactSchema = new Schema({
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

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;

// class ContactsModel {
//   findByEmail(email) {
//     return contacts.find((contact) => contact.email === email);
//   }

//   findByPhone(phone) {
//     return contacts.find((contact) => contact.phone === phone);
//   }

//   listContacts() {
//     return contacts;
//   }

//   getContactById(contactId) {
//     const contact = contacts.find(
//       (contact) => String(contact.id) === contactId
//     );
//     return contact;
//   }

//   addContact(createParams) {
//     const newContact = {
//       ...createParams,
//       id: uuid.v4(),
//     };

//     contacts.push(newContact);
//     return newContact;
//   }

//   removeContact(contactId) {
//     const contactIndex = contacts.findIndex(
//       (contact) => String(contact.id) === contactId
//     );
//     if (contactIndex === -1) {
//       return null;
//     }
//     const [deletedContact] = contacts.splice(contactIndex, 1);
//     return deletedContact;
//   }

//   updateContact = (contactId, updateParams) => {
//     const contactIndex = contacts.findIndex(
//       (contact) => String(contact.id) === contactId
//     );
//     if (contactIndex === -1) {
//       return null;
//     }
//     contacts[contactIndex] = {
//       ...contacts[contactIndex],
//       ...updateParams,
//       id: uuid.v4(),
//     };
//     return contacts[contactIndex];
//   };
// }

// module.exports = new ContactsModel();
