const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

class UserController {
  constructor() {
    this.jwtSecret  = process.env.JWT_SECRET || '';
    this.validateToken = this.validateToken.bind(this)
  }

  async login(email, password) {
    try {
      const user = await userSchema.findOne({ email });
      if (!user) {
        return { status: "error", message: "User not found" };
      }

      //Comparar la contraseña que ingresa el usuario, con la hasheada
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return { status: "error", message: "Invalid password" };
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, avatar: user.avatar, fullname: `${user.name} ${user.lastname}` },
        this.jwtSecret, {expiresIn: '1h'}
      );
      user.password = null;
      return { status: "success", token: token, "user" : user };

    } catch (error) {
      console.log(error);
      return { status: "error", message: "Failed to login" };
    }
  }

  validateToken(req, res, next) {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return res
        .status(401)
        .json({ status: "error", message: "Token does not exist" });
    }

    const token = bearerToken.startsWith("Bearer ")
      ? bearerToken.slice(7)
      : bearerToken;
      console.log(token);
    jwt.verify(token, this.jwtSecret, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid token" });
      }
      req.userId = decoded.userId;
      next();
    });
  }
}
module.exports = UserController;
