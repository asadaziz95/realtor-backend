import jwt from "jsonwebtoken";

export const adminsToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("error", err)
        return res.status(400).json({ message: "Token is not Valid!" });
      }
      if (user.status == 2) {
        return res.status(403).json({ message: "Forbidden. access required." });
    }
    else {
          req.user = user;
          next()
      }

    });
  } else {
    return res.status(401).json({ message: "You are not Authenticated" });
  }
};