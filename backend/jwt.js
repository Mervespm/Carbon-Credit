// Used for reference https://www.youtube.com/watch?v=mbsmsi7l3r4
import jwt from "jsonwebtoken";
import "dotenv/config";

// Verifies if token exists and is valid
const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(`Verifying Token: ${token}`);

    jwt.verify(token, process.env.ACCESS_TOKEN_HASH, (err, decoded) => {
      if (err) {
        console.log(`Invalid token: ${err}`);
        return res.status(401).redirect("/api/login");
      }
      req.decoded_token = decoded;
      return next();
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(401).redirect("/api/login");
  }
};

export default verifyUser;
