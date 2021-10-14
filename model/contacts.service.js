const { Conflict, NotFound } = require("http-errors");
const ContactsModel = require("./contacts.model");

class ContactService {
  createContact(createParams) {
    const { email, phone } = createParams;
    const existingEmail = ContactsModel.findByEmail(email);
    if (existingEmail) {
      throw new Conflict("Contact with such email already exists");
    }
    const existingPhone = ContactsModel.findByPhone(phone);
    if (existingPhone) {
      throw new Conflict("Contact with such phone already exists");
    }

    const newContact = ContactsModel.addContact(createParams);
    return newContact;
  }

  getContacts() {
    return ContactsModel.listContacts();
  }

  getContactById(contactId) {
    const contact = ContactsModel.getContactById(contactId);
    if (!contact) {
      throw new NotFound("Contact not found");
    }
    return contact;
  }

  removeContact(contactId) {
    const deletedContact = ContactsModel.removeContact(contactId);
    if (!deletedContact) {
      throw new NotFound("Contact not found");
    }
  }

  updateContact(contactId, updateParams) {
    console.log(`object`, "name" in updateParams);
    if (
      !"name" in updateParams ||
      !"email" in updateParams ||
      !"phone" in updateParams
    ) {
      throw new NotFound("missing request body");
    }
    const updateContact = ContactsModel.updateContact(contactId, updateParams);
    if (!updateContact) {
      throw new NotFound("Contact not found");
    }
    return updateContact;
  }
}

exports.contactsService = new ContactService();
