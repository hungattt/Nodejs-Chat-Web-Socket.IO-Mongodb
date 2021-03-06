const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const messageController = require("../controllers/messageController");

router.get("/", catchErrors(messageController.getMessage));


module.exports = router;