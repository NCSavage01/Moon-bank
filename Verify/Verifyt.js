import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) 
    return res.status(401).json({ message: "Access Denied!" });

  try {
    const verified = jwt.verify(token, process.env.JWT);
    req.user = verified;

    next();
  } catch {
    res.status(400).json({ message: "Invalid Token!" });
  }
};
