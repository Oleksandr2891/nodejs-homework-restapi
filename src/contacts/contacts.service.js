const {
  Types: { ObjectId },
} = require("mongoose");
const { Conflict, NotFound, BadRequest } = require("http-errors");
const Contact = require("./contacts.model");

class ContactService {
  async getContacts(userId, query) {
    const { favorite = null, limit = 10, page = 1 } = query;
    const searchOptions = { owner: userId };
    if (favorite !== null) {
      searchOptions.favorite = favorite;
    }
    const results = await Contact.paginate(searchOptions, {
      limit,
      page,
      populate: {
        path: "owner",
        select: "email",
      },
    });
    const { docs: contacts } = results;
    delete results.docs;
    return { ...results, contacts };
  }

  async getContactById(contactId, userId) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    const contact = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({
      path: "owner",
      select: "name email gender createdAt updatedAt",
    });
    if (!contact) {
      throw new NotFound("Contact not found");
    }
    return contact;
  }

  async createContact(createParams, userId) {
    const { email, phone, owner } = createParams;

    const existingEmail = await Contact.findOne({ email, owner });
    if (existingEmail) {
      throw new Conflict("Contact with such email already exists");
    }
    const existingPhone = await Contact.findOne({ phone, owner });
    if (existingPhone) {
      throw new Conflict("Contact with such phone already exists");
    }

    const newContact = Contact.create(createParams);
    return newContact;
  }

  async updateContact(contactId, userId, updateParams) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    if (
      "name" in updateParams ||
      "email" in updateParams ||
      "phone" in updateParams
    ) {
      const updateContact = await Contact.findOneAndUpdate(
        { _id: contactId, owner: userId },
        {
          $set: updateParams,
        },
        { new: true }
      );
      if (!updateContact) {
        throw new NotFound("Contact not found");
      }
      return updateContact;
    } else {
      throw new NotFound("missing request body");
    }
  }

  async removeContact(contactId, userId) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    const deletedContact = await Contact.findOneAndRemove({
      _id: contactId,
      owner: userId,
    });
    if (!deletedContact) {
      throw new NotFound("Contact not found");
    }
  }

  async updateStatusContact(contactId, userId, updateParams) {
    if (!ObjectId.isValid(contactId)) {
      throw new NotFound("Your contactId is not valid");
    }
    if (!("favorite" in updateParams)) {
      throw new BadRequest("Missing field favorite");
    }
    const updateStatusContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
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
