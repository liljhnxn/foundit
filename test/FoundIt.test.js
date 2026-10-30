const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FoundIt Contract", function () {
  let FoundIt;
  let foundIt;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    FoundIt = await ethers.getContractFactory("FoundIt");
    foundIt = await FoundIt.deploy();
    await foundIt.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should start with 0 total listings", async function () {
      expect(await foundIt.totalListingsCount()).to.equal(0);
      const all = await foundIt.getAllListings();
      expect(all.length).to.equal(0);
    });
  });

  describe("createListing", function () {
    it("Should successfully create a Lost listing", async function () {
      const tx = await foundIt.connect(addr1).createListing(
        "Black Leather Wallet",
        "Contains student ID and library card",
        "Central Library 2nd Floor",
        0 // Lost
      );

      await expect(tx)
        .to.emit(foundIt, "ListingCreated")
        .withArgs(
          1,
          addr1.address,
          "Black Leather Wallet",
          0,
          "Central Library 2nd Floor",
          await ethers.provider.getBlock("latest").then((b) => b.timestamp)
        );

      expect(await foundIt.totalListingsCount()).to.equal(1);

      const listing = await foundIt.getListing(1);
      expect(listing.id).to.equal(1);
      expect(listing.name).to.equal("Black Leather Wallet");
      expect(listing.description).to.equal("Contains student ID and library card");
      expect(listing.location).to.equal("Central Library 2nd Floor");
      expect(listing.listingType).to.equal(0);
      expect(listing.poster).to.equal(addr1.address);
      expect(listing.isResolved).to.be.false;
      expect(listing.isDeleted).to.be.false;
    });

    it("Should successfully create a Found listing", async function () {
      await foundIt.connect(addr2).createListing(
        "Silver Keys with Blue Keychain",
        "Found on bench near park entrance",
        "City Park North Gate",
        1 // Found
      );

      const listing = await foundIt.getListing(1);
      expect(listing.listingType).to.equal(1);
      expect(listing.poster).to.equal(addr2.address);
    });

    it("Should revert if name is empty", async function () {
      await expect(
        foundIt.connect(addr1).createListing("", "Description", "Location", 0)
      ).to.be.revertedWithCustomError(foundIt, "EmptyField").withArgs("name");
    });

    it("Should revert if description is empty", async function () {
      await expect(
        foundIt.connect(addr1).createListing("Name", "", "Location", 0)
      ).to.be.revertedWithCustomError(foundIt, "EmptyField").withArgs("description");
    });

    it("Should revert if location is empty", async function () {
      await expect(
        foundIt.connect(addr1).createListing("Name", "Description", "", 0)
      ).to.be.revertedWithCustomError(foundIt, "EmptyField").withArgs("location");
    });
  });

  describe("resolveListing", function () {
    beforeEach(async function () {
      await foundIt.connect(addr1).createListing(
        "AirPods Pro Case",
        "White case with small scratch",
        "Gym Locker Room",
        0
      );
    });

    it("Should allow the owner to resolve their listing", async function () {
      const tx = await foundIt.connect(addr1).resolveListing(1);
      await expect(tx).to.emit(foundIt, "ListingResolved");

      const listing = await foundIt.getListing(1);
      expect(listing.isResolved).to.be.true;
    });

    it("Should prevent unauthorized users from resolving", async function () {
      await expect(
        foundIt.connect(addr2).resolveListing(1)
      ).to.be.revertedWithCustomError(foundIt, "NotListingOwner");
    });

    it("Should prevent resolving an already resolved listing", async function () {
      await foundIt.connect(addr1).resolveListing(1);
      await expect(
        foundIt.connect(addr1).resolveListing(1)
      ).to.be.revertedWithCustomError(foundIt, "AlreadyResolved");
    });
  });

  describe("deleteListing", function () {
    beforeEach(async function () {
      await foundIt.connect(addr1).createListing(
        "Umbrella",
        "Black foldable umbrella",
        "Cafeteria",
        1
      );
    });

    it("Should allow the owner to delete their listing", async function () {
      const tx = await foundIt.connect(addr1).deleteListing(1);
      await expect(tx).to.emit(foundIt, "ListingDeleted");

      const all = await foundIt.getAllListings();
      expect(all.length).to.equal(0);
    });

    it("Should prevent unauthorized users from deleting", async function () {
      await expect(
        foundIt.connect(addr2).deleteListing(1)
      ).to.be.revertedWithCustomError(foundIt, "NotListingOwner");
    });

    it("Should not return deleted listings in getAllListings or getMyListings", async function () {
      await foundIt.connect(addr1).createListing(
        "Watch",
        "Classic wrist watch",
        "Auditorium",
        0
      );

      let all = await foundIt.getAllListings();
      expect(all.length).to.equal(2);

      await foundIt.connect(addr1).deleteListing(1);

      all = await foundIt.getAllListings();
      expect(all.length).to.equal(1);
      expect(all[0].id).to.equal(2);

      const myListings = await foundIt.connect(addr1).getMyListings();
      expect(myListings.length).to.equal(1);
      expect(myListings[0].id).to.equal(2);
    });
  });

  describe("getMyListings", function () {
    it("Should return only listings belonging to the caller", async function () {
      await foundIt.connect(addr1).createListing("Item 1", "Desc 1", "Loc 1", 0);
      await foundIt.connect(addr2).createListing("Item 2", "Desc 2", "Loc 2", 1);
      await foundIt.connect(addr1).createListing("Item 3", "Desc 3", "Loc 3", 0);

      const addr1Listings = await foundIt.connect(addr1).getMyListings();
      expect(addr1Listings.length).to.equal(2);
      expect(addr1Listings[0].name).to.equal("Item 1");
      expect(addr1Listings[1].name).to.equal("Item 3");

      const addr2Listings = await foundIt.connect(addr2).getMyListings();
      expect(addr2Listings.length).to.equal(1);
      expect(addr2Listings[0].name).to.equal("Item 2");
    });
  });
});

