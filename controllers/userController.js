const asynchandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUser = asynchandler(async (req, res) => {
  const { id, email } = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  res.status(200).json({
    id,
    email,
  });
});

const signup = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please Complete");
  }

  const email_exist = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (email_exist) {
    res.status(400);
    throw new Error("Email already used");
  }
  const salt = await bcrypt.genSalt(15);
  const encryptedpassword = await bcrypt.hash(password, salt);

  const createuser = await prisma.user.create({
    data: {
      email,
      password: encryptedpassword,
    },
  });

  res.status(201).json({
    token: createToken(createuser.id),
  });
});

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (email.length < 6) {
    res.status(400);
    throw new Error("Password too short");
  }
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Complete");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      token: createToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Wrong Credentials");
  }
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  getUser,
  signup,
  login,
};
