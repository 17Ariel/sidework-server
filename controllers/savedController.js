const asynchandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addSavedpost = asynchandler(async (req, res) => {
  const alreadySaved = await prisma.saved.findFirst({
    where: {
      userId: req.user.id,
      listingId: parseInt(req.params.id),
    },
  });

  if (alreadySaved) {
    const unsaved = await prisma.saved.delete({
      where: {
        id: alreadySaved.id,
      },
    });

    res.status(200).json(unsaved.id);
  } else {
    const savedPost = await prisma.saved.create({
      data: {
        userId: req.user.id,
        listingId: parseInt(req.params.id),
      },
    });
    res.status(200).json(savedPost);
  }
});

const getSaved = asynchandler(async (req, res) => {
  const save = await prisma.saved.findMany({
    where: {
      userId: req.user.id,
    },
    select: {
      listing: true,
    },
  });
  res.status(200).json(save);
});

const getOnesaved = asynchandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(401);
    throw new Error("Listing Id not found!");
  }
  const saved = await prisma.saved.findMany({
    where: {
      listingId: parseInt(req.params.id),
      userId: req.user.id,
    },
  });
  res.status(200).json(saved);
});

const unSaved = asynchandler(async (req, res) => {
  const alreadySaved = await prisma.saved.findFirst({
    where: {
      userId: req.user.id,
      listingId: parseInt(req.params.id),
    },
  });

  if (alreadySaved) {
    await prisma.saved.delete({
      where: {
        id: alreadySaved.id,
      },
    });
    const save = await prisma.saved.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        listing: true,
      },
    });
    res.status(200).json(save);
  }
});

module.exports = {
  addSavedpost,
  getOnesaved,
  getSaved,
  unSaved,
};
