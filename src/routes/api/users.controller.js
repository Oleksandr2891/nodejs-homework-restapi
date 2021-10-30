const { Router } = require("express");
const { authorize } = require("../../auth/users.middleware");
const { authService } = require("../../auth/users.service");
const { validate } = require("../../helpers/validate");
const {
  signUpSchema,
  signInSchema,
  updateStatrusUserSchema,
} = require("../../auth/users.schema");
const {
  serializeUser,
  serializeUserWithToken,
} = require("../../auth/users.serializer");

signUpSchema.validate({}, { stripUnknown: true }); //delete unknown elements

const router = Router();

router.post("/signup", validate(signUpSchema), async (req, res, next) => {
  try {
    const user = await authService.signUp(req.body);
    res.status(201).send(serializeUser(user));
  } catch (error) {
    next(error);
  }
});

router.post("/login", validate(signInSchema), async (req, res, next) => {
  try {
    const userWithToken = await authService.signIn(req.body);
    res.status(201).send(serializeUserWithToken(userWithToken));
  } catch (err) {
    next(err);
  }
});

router.post("/logout", authorize(), async (req, res, next) => {
  try {
    const logoutStatus = await authService.logout(req.user);
    res.status(204).send(logoutStatus);
  } catch (error) {
    next(error);
  }
});

router.get("/current", authorize(), async (req, res, next) => {
  try {
    const user = req.user;
    res.status(201).send(serializeUser(user));
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/",
  authorize(),
  validate(updateStatrusUserSchema),
  async (req, res, next) => {
    try {
      const updateStatusUser = await authService.updateStatusUser(
        req.user,
        req.body
      );
      res.status(200).send(serializeUser(updateStatusUser));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
