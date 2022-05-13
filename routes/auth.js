import { Router } from "express";
import { SignIn, Signup, Recover, Reset, Logout } from "../handlers/auth.js";
import { GetLoggedInUserInfos } from "../handlers/user.js";

export default function Routes(User) {
    const router = Router();
    router.post("/logout", Logout);

    router.post("/signup", Signup(User), GetLoggedInUserInfos);

    router.post("/signin", SignIn(User), GetLoggedInUserInfos);
    router.post("/recover", Recover(User));
    router.post("/recover/:id", Reset);
    return router;
}
