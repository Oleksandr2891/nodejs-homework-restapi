const express = require("express");
const router = express.Router();
const { validate } = require("../../helpers/validate");
const {
  createContactSchema,
  updateContactSchema,
  updateStatrusContactSchema,
} = require("../../contacts/contacts.schema");
const { contactsService } = require("../../contacts/contacts.service");
const { authorize } = require("../../auth/users.middleware");

createContactSchema.validate({}, { stripUnknown: true }); //delete unknown elements
updateStatrusContactSchema.validate({}, { stripUnknown: true }); //delete unknown elements

router.get("/", authorize(), async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await contactsService.getContacts(userId, req.query);
    return res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authorize(), async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await contactsService.getContactById(
      req.params.contactId,
      userId
    );

    return res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  validate(createContactSchema),
  authorize(),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const newContact = await contactsService.createContact({
        ...req.body,
        owner: userId,
      });
      return res.status(201).send(newContact);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:contactId", authorize(), async (req, res, next) => {
  try {
    const userId = req.user._id;
    await contactsService.removeContact(req.params.contactId, userId);

    return res.status(200).send({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:contactId",
  authorize(),
  validate(updateContactSchema),
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const updateContact = await contactsService.updateContact(
        req.params.contactId,
        userId,
        req.body
      );
      return res.status(200).send(updateContact);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:contactId/favorite",
  authorize(),
  validate(updateStatrusContactSchema),
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const updateStatusContact = await contactsService.updateStatusContact(
        req.params.contactId,
        userId,
        req.body
      );
      return res.status(200).send(updateStatusContact);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
