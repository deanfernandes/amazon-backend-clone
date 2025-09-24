import { Router } from "express";
import {
  postUserAddressHandler,
  getUserAddressesHandler,
  getUserAddressHandler,
  putUserAddressHandler,
  deleteUserAddressHandler,
} from "../../controllers/users/userAddresses.js";

const router = Router({ mergeParams: true });
router.post("/", postUserAddressHandler);
router.get("/", getUserAddressesHandler);
router.get("/:id", getUserAddressHandler);
router.put("/:id", putUserAddressHandler);
router.patch("/:id", (req, res) => {});
router.delete("/:id", deleteUserAddressHandler);

export default router;
