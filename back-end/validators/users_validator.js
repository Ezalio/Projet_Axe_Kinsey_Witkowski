import vine from "@vinejs/vine";

const storeUserValidator = vine.object({
  email: vine.string().email(),
  name: vine.string().minLength(3).maxLength(32),
});

export default storeUserValidator;


