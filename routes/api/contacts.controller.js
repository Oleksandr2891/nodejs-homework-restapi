const express = require("express");
const router = express.Router();
const { validate } = require("../../helpers/validate");
const {
  createContactSchema,
  updateContactSchema,
} = require("../../model/contacts.schema");
const { contactsService } = require("../../model/contacts.service");

createContactSchema.validate({}, { stripUnknown: true }); //delete unknown elements

router.get("/", async (req, res, next) => {
  try {
    const contacts = contactsService.getContacts();
    return res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = contactsService.getContactById(req.params.contactId);

    return res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", validate(createContactSchema), async (req, res, next) => {
  try {
    const newContact = contactsService.createContact(req.body);
    return res.status(201).send(newContact);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    contactsService.removeContact(req.params.contactId);

    return res.status(200).send({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:contactId",
  validate(updateContactSchema),
  async (req, res, next) => {
    try {
      const updateContact = contactsService.updateContact(
        req.params.contactId,
        req.body
      );
      return res.status(200).send(updateContact);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
