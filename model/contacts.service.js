const {
  Types: { ObjectId },
} = require("mongoose");
const { Conflict, NotFound, BadRequest } = require("http-errors");
const Contact = require("./contacts.model");

class ContactService {
  async getContacts() {
    return Contact.find();
  }

  async getContactById(contactId) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFound("Contact not found");
    }
    return contact;
  }

  async createContact(createParams) {
    const { email, phone } = createParams;

    const existingEmail = await Contact.findOne({ email });
    if (existingEmail) {
      throw new Conflict("Contact with such email already exists");
    }
    const existingPhone = await Contact.findOne({ phone });
    if (existingPhone) {
      throw new Conflict("Contact with such phone already exists");
    }

    const newContact = Contact.create(createParams);
    return newContact;
  }

  async updateContact(contactId, updateParams) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    if (
      !"name" in updateParams ||
      !"email" in updateParams ||
      !"phone" in updateParams
    ) {
      throw new NotFound("missing request body");
    }
    const updateContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: updateParams,
      },
      { new: true }
    );
    if (!updateContact) {
      throw new NotFound("Contact not found");
    }

    return updateContact;
  }

  async removeContact(contactId) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    const deletedContact = await Contact.findByIdAndRemove(contactId);
    if (!deletedContact) {
      throw new NotFound("Contact not found");
    }
  }

  async updateStatusContact(contactId, updateParams) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    if (!("favorite" in updateParams)) {
      throw new BadRequest("Missing field favorite");
    }
    const updateStatusContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: updateParams,
      },
      { new: true }
    );
    if (!updateStatusContact) {
      throw new NotFound("Contact not found");
    }

    return updateStatusContact;
  }
}

exports.contactsService = new ContactService();
