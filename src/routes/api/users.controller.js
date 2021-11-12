const { Router } = require("express");
const { authorize, compressImage } = require("../../auth/users.middleware");
const { authService } = require("../../auth/users.service");
const { validate } = require("../../helpers/validate");
const path = require("path");

const multer = require("multer");
const {
  signUpSchema,
  signInSchema,
  updateStatrusUserSchema,
  secondaryValidateSchema,
} = require("../../auth/users.schema");
const {
  serializeUser,
  serializeUserWithToken,
  serializeUserAvatar,
} = require("../../auth/users.serializer");

signUpSchema.validate({}, { stripUnknown: true }); //delete unknown elements

const router = Router();
const DRAFT_DIR = path.join(__dirname, "../../../tmp");
const storage = multer.diskStorage({
  destination: DRAFT_DIR,
  filename: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new BadRequest("Only images allowed"));
    }
    // const ext = path.extname(file.originalname);
    // cb(null, `${Date.now()}${ext}`);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
  } catch (error) {
    next(error);
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

router.patch(
  "/avatars",
  authorize(),
  upload.single("avatar"),
  compressImage(),
  async (req, res, next) => {
    try {
      const updateAvatarUser = await authService.updateAvatarUser(
        req.user,
        req.file
      );
      res.status(200).send(serializeUserAvatar(updateAvatarUser));
    } catch (error) {
      next(error);
    }
  }
);

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    await authService.verifyUser(req.params.verificationToken);
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/verify",
  validate(secondaryValidateSchema),
  async (req, res, next) => {
    try {
      await authService.secondaryVerifyUser(req.body);
      res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
