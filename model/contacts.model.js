const uuid = require("uuid");
const fs = require("fs/promises");
const contacts = require("./contacts.json");

class ContactsModel {
  findByEmail(email) {
    return contacts.find((contact) => contact.email === email);
  }

  findByPhone(phone) {
    return contacts.find((contact) => contact.phone === phone);
  }

  listContacts() {
    return contacts;
  }

  getContactById(contactId) {
    const contact = contacts.find(
      (contact) => String(contact.id) === contactId
    );
    return contact;
  }

  addContact(createParams) {
    const newContact = {
      ...createParams,
      id: uuid.v4(),
    };

    contacts.push(newContact);
    return newContact;
  }

  removeContact(contactId) {
    const contactIndex = contacts.findIndex(
      (contact) => String(contact.id) === contactId
    );
    if (contactIndex === -1) {
      return null;
    }
    const [deletedContact] = contacts.splice(contactIndex, 1);
    return deletedContact;
  }

  updateContact = (contactId, updateParams) => {
    const contactIndex = contacts.findIndex(
      (contact) => String(contact.id) === contactId
    );
    if (contactIndex === -1) {
      return null;
    }
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      ...updateParams,
      id: uuid.v4(),
    };
    return contacts[contactIndex];
  };
}

module.exports = new ContactsModel();

// const updateContact = async (contactId, body) => {}
