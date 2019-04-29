pragma solidity ^0.5.0;

import "./libs/ListAsRingLib.sol";
import "./libs/EntityLib.sol";
import "./libs/AddressIndexLib.sol";
import "./libs/StringIndexLib.sol";

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract HallOfFame is Ownable {
    using EntityLib for EntityLib.Entities;
    using ListAsRingLib for ListAsRingLib.ListData;
    using AddressIndexLib for AddressIndexLib.Indexes;
    using StringIndexLib for StringIndexLib.Indexes;

    EntityLib.Entities private donators;
    StringIndexLib.Indexes private donatorIndexes;

    EntityLib.Entities private admins;
    AddressIndexLib.Indexes private adminIndexes;

    EntityLib.Entities private groups;
    StringIndexLib.Indexes private groupIndexes;

    mapping (uint => ListAsRingLib.ListData) private groupDonators;

    /**
    * @dev Check if a sender is admin
    */
    modifier onlyAdmin() {
        uint id = adminIndexes.getId(msg.sender);
        require(id > 0, "You are not admin");
        _;
    }

    /**
    * @dev Check if input array has valid size
    */
    modifier validArraySize(uint[] memory _ids, uint _size) {
        require(_ids.length < _size, "array can't be that big");
        _;
    }

    /**
    * @dev Event for adding a donator.
    * @param actor Who added donator (Indexed).
    * @param id donator id (Indexed).
    * @param externalId donator unique code.
    */
    event DonatorAdded(address indexed actor, uint indexed id, string externalId);

    /**
    * @dev Event for editing donator.
    * @param actor Who added donator (Indexed).
    * @param id donator id (Indexed).
    */
    event DonatorUpdated(address indexed actor, uint indexed id);

    /**
    * @dev Event for donator deleting.
    * @param actor Who deleted donator (Indexed).
    * @param id donator id (Indexed).
    */
    event DonatorDeleted(address indexed actor, uint indexed id);

    /**
    * @dev Event for adding a admin.
    * @param actor Who added admin (Indexed).
    * @param id admin id (Indexed).
    * @param admin admin address.
    */
    event AdminAdded(address indexed actor, uint indexed id, address admin);

    /**
    * @dev Event for editing admin.
    * @param actor Who added admin (Indexed).
    * @param id admin id (Indexed).
    */
    event AdminUpdated(address indexed actor, uint indexed id);

    /**
    * @dev Event for admin deleting.
    * @param actor Who deleted admin (Indexed).
    * @param id admin id (Indexed).
    */
    event AdminDeleted(address indexed actor, uint indexed id);
    /**
    * @dev Event for adding a group.
    * @param actor Who added group (Indexed).
    * @param id group id (Indexed).
    * @param groupCode group unique code.
    */
    event GroupAdded(address indexed actor, uint indexed id, string groupCode);

    /**
    * @dev Event for editing group.
    * @param actor Who added group (Indexed).
    * @param id group id (Indexed).
    */
    event GroupUpdated(address indexed actor, uint indexed id);

    /**
    * @dev Event for group deleting.
    * @param actor Who deleted group (Indexed).
    * @param id group id (Indexed).
    */
    event GroupDeleted(address indexed actor, uint indexed id);

    /**
    * @dev Event for adding donator to groups.
    * @param actor actor (Indexed).
    * @param donatorId donator id (Indexed).
    * @param groupIds group ids.
    */
    event DonatorAddedToGroups(address indexed actor, uint indexed donatorId, uint[] groupIds);

    /**
    * @dev Event for removed donator from groups.
    * @param actor actor (Indexed).
    * @param donatorId donator id (Indexed).
    * @param groupIds group ids.
    */
    event DonatorRemovedFromGroups(address indexed actor, uint indexed donatorId, uint[] groupIds);

    /**
    * @dev Event for moving donator in a group.
    * @param actor actor (Indexed).
    * @param groupId group id (Indexed)
    * @param donatorId donator id (Indexed).
    * @param to donator new position after this id
    */
    event DonatorMovedInGroup(address indexed actor, uint groupId, uint indexed donatorId, uint to);

    /**
    * @dev Link donator to groups.
    * @param _donatorId donator ids.
    * @param _removeIds group ids.
    * @param _addIds group ids.
    * //revert
    */
    function linkToGroups(
        uint _donatorId,
        uint[] memory _removeIds,
        uint[] memory _addIds
    )
        public
        validArraySize(_addIds, 50)
        validArraySize(_removeIds, 50)
    {
        uint removeLen = _removeIds.length;
        uint addLen = _addIds.length;

        for (uint i = 0; i < removeLen; i++) {
            require(groups.list.exists(_removeIds[i]), "Can't unassign from unexisting group");
            groupDonators[_removeIds[i]].remove(_donatorId);
        }

        if (removeLen > 0) {
            emit DonatorRemovedFromGroups(msg.sender, _donatorId, _removeIds);
        }

        for (uint i = 0; i < addLen; i++) {
            require(groups.list.exists(_addIds[i]), "Can't assign to unexisting group");
            groupDonators[_addIds[i]].add(_donatorId);
        }
        if (addLen > 0) {
            emit DonatorAddedToGroups(msg.sender, _donatorId, _addIds);
        }
    }

    /**
    * @dev Create a donator
    * @param _data donator info.
    * @param _externalId donator uniq code.
    * @return uint
    */
    function addDonator(
        string memory _data,
        string memory _externalId
    )
    public
    onlyAdmin
    returns(uint)
    {
        uint id = donators.add(_data);
        donatorIndexes.add(_externalId, id);
        emit DonatorAdded(msg.sender, id, _externalId);
        return id;
    }

    /**
    * @dev Create a donator and assign groups
    * @param _data donator info.
    * @param _externalId donator uniq code.
    * @param _linkGroupIds group ids to link.
    * @return uint
    */
    function addDonatorAndLinkGroups(
        string calldata _data,
        string calldata _externalId,
        uint[] calldata _linkGroupIds
    )
    external
    onlyAdmin
    returns(uint)
    {
        uint[] memory unlink = new uint[](0);
        uint id = addDonator(_data, _externalId);
        linkToGroups(id, unlink, _linkGroupIds);
        return id;
    }

    /**
    * @dev Update a donator
    * @param _id donator id.
    * @param _data donator info.
    * @param _externalId donator uniq code.
    * @return uint
    */
    function updateDonator(
        uint _id,
        string memory _data,
        string memory _externalId
    )
    public
    onlyAdmin
    returns(uint)
    {
        donators.update(_id, _data);
        uint id = donatorIndexes.getId(_externalId);
        if (id != _id) {
            donatorIndexes.update(_externalId, _id);
        }
        emit DonatorUpdated(msg.sender, _id);
    }

    /**
    * @dev Update donator and assign groups
    * @param _data donator info.
    * @param _externalId donator uniq code.
    * @param _unlinkGroupIds group ids to unlink.
    * @param _linkGroupIds group ids to link.
    * @return uint
    */
    function updateDonatorAndLinkGroups(
        uint _id,
        string calldata _data,
        string calldata _externalId,
        uint[] calldata _unlinkGroupIds,
        uint[] calldata _linkGroupIds
    )
    external
    onlyAdmin
    returns(uint)
    {
        updateDonator(_id, _data, _externalId);
        linkToGroups(_id, _unlinkGroupIds, _linkGroupIds);
        return _id;
    }

    /**
    * @dev Create a donator
    * @param _id donator id.
    * @return uint
    */
    function removeDonator(
        uint _id
    )
    external
    onlyAdmin
    returns(uint)
    {
        uint groupId = groups.list.getNextId(0);
        uint[] memory removeGroupIds = new uint[](1);
        uint[] memory emptyArray = new uint[](0);
        while (groupId > 0) {
            if (groupDonators[groupId].exists(_id)) {
                removeGroupIds[0] = groupId;
                linkToGroups(_id, removeGroupIds, emptyArray);
            }
//            require(!groupDonators[groupId].exists(_id), "Remove donator from all groups first");
            groupId = groups.list.getNextId(groupId);
        }
        donators.remove(_id);
        donatorIndexes.remove(donatorIndexes.getIndex(_id));
        emit DonatorDeleted(msg.sender, _id);
    }

    /**
    * @dev Get donator.
    * @param _id donator id.
    * @return uint, string
    * //revert
    */
    function getDonator(uint _id) external view returns (
        uint id,
        string memory data,
        uint version,
        string memory index
    ) {
        (id, data, version) = donators.get(_id);
        return (id, data, version, donatorIndexes.getIndex(_id));
    }

    /**
    * @dev Get next donator.
    * @param _id donator id.
    * @return uint
    * //revert
    */
    function nextDonator(uint _id) external view returns (uint) {
        return donators.list.getNextId(_id);
    }

    /**
    * @dev Check if  donators exist.
    * @param _ids donator ids.
    * @return bool[]
    * //revert
    */
    function areDonators(uint[] calldata _ids) external view returns (bool[] memory) {
        return donators.list.statuses(_ids);
    }

    /**
    * @dev Create a group
    * @param _data group info.
    * @param _code group uniq code.
    * @return uint
    */
    function addGroup(
        string calldata _data,
        string calldata _code
    )
    external
    onlyAdmin
    returns(uint)
    {
        uint id = groups.add(_data);
        groupIndexes.add(_code, id);
        emit GroupAdded(msg.sender, id, _code);
    }

    /**
    * @dev Update a group
    * @param _id group id.
    * @param _data group info.
    * @param _code group uniq code.
    * @return uint
    */
    function updateGroup(
        uint _id,
        string calldata _data,
        string calldata _code
    )
    external
    onlyAdmin
    returns(uint)
    {
        groups.update(_id, _data);
        uint id = groupIndexes.getId(_code);
        if (id != _id) {
            groupIndexes.update(_code, _id);
        }
        emit GroupUpdated(msg.sender, _id);
    }

    /**
    * @dev Create a group
    * @param _id group id.
    * @return uint
    */
    function removeGroup(
        uint _id
    )
    external
    onlyAdmin
    returns(uint)
    {
        require(groupDonators[_id].count == 0, "Can't delete non empty group");
        groups.remove(_id);
        groupIndexes.remove(groupIndexes.getIndex(_id));
        delete groupDonators[_id];

        emit GroupDeleted(msg.sender, _id);
    }

    /**
    * @dev Get group.
    * @param _id group id.
    * @return uint, string, string
    * //revert
    */
    function getGroup(uint _id) external view returns (
        uint id,
        string memory data,
        uint version,
        string memory index
    ) {
        (id, data, version) = groups.get(_id);
        return (id, data, version, groupIndexes.getIndex(_id));
    }

    /**
    * @dev Get next group.
    * @param _id group id.
    * @return uint
    * //revert
    */
    function nextGroup(uint _id) external view returns (uint) {
        return groups.list.getNextId(_id);
    }

    /**
    * @dev Check if donators exist.
    * @param _ids donator ids.
    * @return bool[]
    * //revert
    */
    function areGroups(uint[] calldata _ids) external view returns (bool[] memory) {
        return groups.list.statuses(_ids);
    }

    /**
    * @dev Check if donators exist.
    * @param _donatorId donator ids.
    * @param _ids group ids.
    * @return bool[]
    * //revert
    */
    function areInGroups(uint _donatorId, uint[] calldata _ids)
        external
        validArraySize(_ids, 50)
        view
        returns (bool[] memory)
    {
        uint len = _ids.length;
        bool[] memory result = new bool[](len);
        for (uint i = 0; i < len; i++) {
            result[i] = groupDonators[_ids[i]].exists(_donatorId);
        }
        return result;
    }

    /**
    * @dev Get next donator in group.
    * @param _groupId group id.
    * @param _donatorId donator id.
    * @return uint
    * //revert
    */
    function nextGroupDonator(uint _groupId, uint _donatorId) external view returns (uint) {
        return groupDonators[_groupId].getNextId(_donatorId);
    }

    /**
    * @dev Get banch of donators in group. Order dependent
    * @param _groupId group id.
    * @param _fromId donator id.
    * @param _count number of donators.
    * @return uint
    * //revert
    */
    function getGroupDonators(uint _groupId, uint _fromId, uint _count) external view returns (uint[] memory) {
        require(_count <= 1000, "List can't be more than 1000");
        require(_count > 0, "Count can't be 0");
        require(groups.list.exists(_groupId), "group must exist");
        uint[] memory result = new uint[](_count);
        uint id = groupDonators[_groupId].getNextId(_fromId);
        uint i = 0;
        while (id > 0 && i < _count) {
            result[i] = id;
            id = groupDonators[_groupId].getNextId(id);
            i++;
        }
        return result;
    }

    /**
    * @dev Move a donator to a new position
    * @param _groupId group id.
    * @param _id donator id.
    * @param _to set after this position.
    * @return uint
    * //revert
    */
    function moveDonator(uint _groupId, uint _id, uint _to)
        external
        returns (uint)
    {
        groupDonators[_groupId].move_after(_id, _to);
        emit DonatorMovedInGroup(msg.sender, _groupId, _id, _to);
    }

    /**
    * @dev Create an admin
    * @param _data admin info.
    * @param _address admin uniq code.
    * @return uint
    */
    function addAdmin(
        string calldata _data,
        address _address
    )
    external
    onlyOwner
    returns(uint)
    {
        uint id = admins.add(_data);
        adminIndexes.add(_address, id);

        emit AdminAdded(msg.sender, id, _address);
    }

    /**
    * @dev Update an admin
    * @param _id admin id.
    * @param _data admin info.
    * @param _address admin uniq code.
    * @return uint
    */
    function updateAdmin(
        uint _id,
        string calldata _data,
        address _address
    )
    external
    onlyOwner
    returns(uint)
    {
        admins.update(_id, _data);
        uint id = adminIndexes.getId(_address);
        if (id != _id) {
            adminIndexes.update(_address, _id);
        }
        emit AdminUpdated(msg.sender, _id);
    }

    /**
    * @dev Create a admin
    * @param _id admin id.
    * @return uint
    */
    function removeAdmin(
        uint _id
    )
    external
    onlyOwner
    returns(uint)
    {
        admins.remove(_id);
        adminIndexes.remove(adminIndexes.getIndex(_id));

        emit AdminDeleted(msg.sender, _id);
    }

    /**
    * @dev Get admin.
    * @param _id admin id.
    * @return uint, string, string
    * //revert
    */
    function getAdmin(uint _id) external view returns (
        uint id,
        string memory data,
        uint version,
        address index
    ) {
        (id, data, version) = admins.get(_id);
        return (id, data, version, adminIndexes.getIndex(_id));
    }

    /**
    * @dev Get next admin.
    * @param _id admin id.
    * @return uint
    * //revert
    */
    function nextAdmin(uint _id) external view returns (uint) {
        return admins.list.getNextId(_id);
    }

    /**
    * @dev Check if admins exist.
    * @param _ids admin ids.
    * @return bool[]
    * //revert
    */
    function areAdmins(uint[] calldata _ids) external view returns (bool[] memory) {
        return admins.list.statuses(_ids);
    }
}
