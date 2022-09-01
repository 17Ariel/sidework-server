const asynchandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getYourlisting = asynchandler(async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.status(200).json(listings);
});

const getAvailablelistings = asynchandler(async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: {
      status: "available",
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  res.status(200).json(listings);
});

const getOnelistings = asynchandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(401);
    throw new Error("Listing Id not found!");
  }
  const listings = await prisma.listing.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  res.status(200).json(listings);
});

const addListings = asynchandler(async (req, res) => {
  const { title, description, skills, location, email } = req.body;
  const status = "available";
  if (!title || !description || !skills || !location || !email) {
    res.status(400);
    throw new Error("Please Complete");
  }

  const listings = await prisma.listing.create({
    data: {
      title,
      description,
      skills,
      location,
      status,
      email,
      userId: req.user.id,
    },
  });

  res.status(200).json(listings);
});

const deleteListing = asynchandler(async (req, res) => {
  const listings = await prisma.listing.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  if (listings.userId !== user.id) {
    res.status(401);
    throw new Error("Authorization not found!");
  }
  const listingdelete = await prisma.listing.delete({
    where: {
      id: listings.id,
    },
  });
  res.status(200).json(listingdelete.id);
  // try {
  //   const listingdelete = await prisma.listing.delete({
  //     where: {
  //       id: listings.id,
  //     },
  //   });
  //   res.status(200).json(listingdelete.id);
  // } catch (error) {
  //   res.status(401);
  //   throw new Error("Can't delete!");
  // }
});

const updateListing = asynchandler(async (req, res) => {
  const { title, description, skills, location, status, email } = req.body;

  if (!title || !description || !skills || !location || !email) {
    res.status(400);
    throw new Error("Please Complete");
  }

  const listings = await prisma.listing.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  if (listings.userId !== user.id) {
    res.status(401);
    throw new Error("Authorization not found!");
  }

  const editedlisting = await prisma.listing.update({
    data: {
      title,
      description,
      skills,
      location,
      status,
      email,
    },
    where: {
      id: listings.id,
    },
  });

  res.status(200).json(editedlisting);
});

const setnotAvailable = asynchandler(async (req, res) => {
  const status = "Unavailable";

  const listings = await prisma.listing.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found!");
  }

  if (listings.userId !== user.id) {
    res.status(401);
    throw new Error("Authorization not found!");
  }

  await prisma.listing.update({
    data: {
      status,
    },
    where: {
      id: listings.id,
    },
  });

  const listing = await prisma.listing.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  res.status(200).json(listing);
});

const searchListing = asynchandler(async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: {
      OR: [
        {
          title: {
            startsWith: req.params.id,
          },
        },
        {
          description: {
            startsWith: req.params.id,
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  try {
    res.status(200).json(listings);
  } catch (error) {
    res.status(401);
    throw new Error("Invalid search query!");
  }
});

module.exports = {
  getAvailablelistings,
  getOnelistings,
  getYourlisting,
  addListings,
  deleteListing,
  updateListing,
  searchListing,
  setnotAvailable,
};
