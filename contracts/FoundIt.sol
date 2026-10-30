// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FoundIt
 * @dev Decentralized lost-and-found board where users publish lost or found items.
 */
contract FoundIt {
    enum ListingType {
        Lost,
        Found
    }

    struct Listing {
        uint256 id;
        string name;
        string description;
        string location;
        ListingType listingType;
        address poster;
        uint256 timestamp;
        bool isResolved;
        bool isDeleted;
    }

    uint256 private _listingCounter;
    mapping(uint256 => Listing) private _listings;
    uint256[] private _listingIds;

    // Events
    event ListingCreated(
        uint256 indexed id,
        address indexed poster,
        string name,
        ListingType listingType,
        string location,
        uint256 timestamp
    );

    event ListingResolved(
        uint256 indexed id,
        address indexed poster,
        uint256 timestamp
    );

    event ListingDeleted(
        uint256 indexed id,
        address indexed poster,
        uint256 timestamp
    );

    // Errors
    error EmptyField(string fieldName);
    error ListingNotFound(uint256 id);
    error ListingAlreadyDeleted(uint256 id);
    error NotListingOwner(uint256 id, address caller);
    error AlreadyResolved(uint256 id);

    /**
     * @notice Create a new Lost or Found listing.
     * @param _name Name/title of the item
     * @param _description Short details describing the item
     * @param _location General location where item was lost or found
     * @param _listingType 0 for Lost, 1 for Found
     */
    function createListing(
        string calldata _name,
        string calldata _description,
        string calldata _location,
        ListingType _listingType
    ) external returns (uint256) {
        if (bytes(_name).length == 0) revert EmptyField("name");
        if (bytes(_description).length == 0) revert EmptyField("description");
        if (bytes(_location).length == 0) revert EmptyField("location");

        _listingCounter++;
        uint256 newId = _listingCounter;

        _listings[newId] = Listing({
            id: newId,
            name: _name,
            description: _description,
            location: _location,
            listingType: _listingType,
            poster: msg.sender,
            timestamp: block.timestamp,
            isResolved: false,
            isDeleted: false
        });

        _listingIds.push(newId);

        emit ListingCreated(
            newId,
            msg.sender,
            _name,
            _listingType,
            _location,
            block.timestamp
        );

        return newId;
    }

    /**
     * @notice Mark an existing listing as resolved.
     * @dev Only the listing poster can resolve it.
     * @param _id Listing ID
     */
    function resolveListing(uint256 _id) external {
        Listing storage listing = _listings[_id];
        if (listing.id == 0) revert ListingNotFound(_id);
        if (listing.isDeleted) revert ListingAlreadyDeleted(_id);
        if (listing.poster != msg.sender) revert NotListingOwner(_id, msg.sender);
        if (listing.isResolved) revert AlreadyResolved(_id);

        listing.isResolved = true;

        emit ListingResolved(_id, msg.sender, block.timestamp);
    }

    /**
     * @notice Soft-delete an existing listing.
     * @dev Only the listing poster can delete it.
     * @param _id Listing ID
     */
    function deleteListing(uint256 _id) external {
        Listing storage listing = _listings[_id];
        if (listing.id == 0) revert ListingNotFound(_id);
        if (listing.isDeleted) revert ListingAlreadyDeleted(_id);
        if (listing.poster != msg.sender) revert NotListingOwner(_id, msg.sender);

        listing.isDeleted = true;

        emit ListingDeleted(_id, msg.sender, block.timestamp);
    }

    /**
     * @notice Retrieve all active (non-deleted) listings.
     * @return Array of all active listings
     */
    function getAllListings() external view returns (Listing[] memory) {
        uint256 total = _listingIds.length;
        uint256 activeCount = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 id = _listingIds[i];
            if (!_listings[id].isDeleted) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 id = _listingIds[i];
            if (!_listings[id].isDeleted) {
                activeListings[currentIndex] = _listings[id];
                currentIndex++;
            }
        }

        return activeListings;
    }

    /**
     * @notice Retrieve all active listings created by the caller.
     * @return Array of caller's active listings
     */
    function getMyListings() external view returns (Listing[] memory) {
        uint256 total = _listingIds.length;
        uint256 myCount = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 id = _listingIds[i];
            if (!_listings[id].isDeleted && _listings[id].poster == msg.sender) {
                myCount++;
            }
        }

        Listing[] memory myListings = new Listing[](myCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 id = _listingIds[i];
            if (!_listings[id].isDeleted && _listings[id].poster == msg.sender) {
                myListings[currentIndex] = _listings[id];
                currentIndex++;
            }
        }

        return myListings;
    }

    /**
     * @notice Get a single listing by its ID.
     * @param _id Listing ID
     */
    function getListing(uint256 _id) external view returns (Listing memory) {
        Listing memory listing = _listings[_id];
        if (listing.id == 0) revert ListingNotFound(_id);
        return listing;
    }

    /**
     * @notice Total number of listings created since deployment.
     */
    function totalListingsCount() external view returns (uint256) {
        return _listingCounter;
    }
}

