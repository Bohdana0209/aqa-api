import { th } from "@faker-js/faker";
import BaseController from "./BaseController";

export default class AuthController extends BaseController {

    signUp(userData) {
        return this.client.post("/api/auth/signup", userData);
    }

    signIn(credentials) {
        return this.client.post("/api/auth/signin", credentials)
    }
}