import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract the token from the "Bearer <token>" format

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
      req.userId = decoded.id; // Attach the user ID from the token payload to the request object for use in subsequent middleware or route handlers
      next(); // Call the next middleware or route handler
      return;
    } catch (error) {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      next(err);
      return;
    }
  }

  const error = new Error("Authorization token is required");
  error.statusCode = 401;
  next(error);
};
