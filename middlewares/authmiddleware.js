const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authUser = asynchandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: {
          id: decode.id,
        },
        select: {
          id: true,
        },
      });

      next();
    } catch (err) {
      res.status(401);
      throw new Error("Wrong Authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, Token doesn't exist");
  }
});

module.exports = {
  authUser,
};
