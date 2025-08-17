import {
    signupCreate,
    login,
} from "../../Controller/signupLogin.js"; // Import your signupLogin controller

import validator from "../../Middleware/validators/validators.middleware.js";
import { validators } from "../../Validators/auth/index.validators.js"

app.post("/signup", validator(validators.auth.SignupValidator), signupCreate); // Route for signup
app.post("/login", login); // Route for login

export default app;