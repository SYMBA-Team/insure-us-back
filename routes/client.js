import { Router } from "express";
import {
    editProfile,
    GetLoggedInUserInfos,
    getClients,
} from "../handlers/user.js";
import {
    checkLogs,
    loggedIn,
    isSameUser,
    isAdmin,
} from "../middlewares/auth.js";

const router = Router();
router.route("/").put(isAdmin, getClients);
router.all("*", checkLogs, loggedIn);
router.route("/").put(isSameUser, editProfile, GetLoggedInUserInfos);

export default router;
