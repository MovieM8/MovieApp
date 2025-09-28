import {
    createGroup,
    getAllGroups,
    getGroupById,
    removeGroup,
    requestToJoin,
    updateMembership,
    removeMember,
    addMovieToGroup,
    addScreeningToGroup,
    getPendingRequests,
    getUserMembershipStatus,
    getAllGroupMembers,
    getGroupsByUser,
} from "../models/Group.js";
import { ApiError } from "../helper/ApiError.js";

// Create group
const createGroupController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const { groupname } = req.body;
        if (!groupname) return next(new ApiError("Group name required", 400));

        const group = await createGroup(userId, groupname);
        res.status(201).json(group);
    } catch (err) {
        next(err);
    }
};

// List groups (public)
const listGroups = async (req, res, next) => {
    try {
        const groups = await getAllGroups();
        res.status(200).json(groups);
    } catch (err) {
        next(err);
    }
};

// Get Membership status (for logged in user)
const getGroupMembership = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId } = req.params;

        const membershipStatus = await getUserMembershipStatus(groupId, userId);
        res.status(200).json(membershipStatus);
    } catch (err) {
        next(err);
    }
};

// Group details (only members)
const getGroupDetails = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId } = req.params;
        const group = await getGroupById(groupId, userId);
        const membershipStatus = await getUserMembershipStatus(groupId, userId);

        if (!group) return next(new ApiError("Not authorized or group not found", 403));
        if (!membershipStatus) return next(new ApiError("Not authorized or group not found", 403));

        res.status(200).json({
            ...group,
            membershipStatus,
        });
    } catch (err) {
        next(err);
    }
};

// Delete group (only owner)
const deleteGroup = async (req, res, next) => {
    try {
        const ownerId = req.user?.id;
        const { groupId } = req.params;

        // Ensure user is group owner
        const group = await getGroupById(groupId, ownerId);
        if (!group || group.groupowner !== ownerId) {
            return next(new ApiError("Only the group owner can delete this group", 403));
        }

        const deleted = await removeGroup(groupId, ownerId);
        if (!deleted) return next(new ApiError("Group not found", 404));

        res.status(200).json({ message: "Group deleted", deleted });
    } catch (err) {
        next(err);
    }
};

// Request to join
const joinGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId } = req.params;
        const request = await requestToJoin(groupId, userId);
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
};

// Approve/reject join (only owner)
const handleJoinRequest = async (req, res, next) => {
    try {
        const ownerId = req.user?.id;
        const { groupId, userId } = req.params;
        const { approve } = req.body; // true or false

        // Check ownership
        const group = await getGroupById(groupId, ownerId);
        if (!group || group.groupowner !== ownerId) {
            return next(new ApiError("Only the group owner can manage join requests", 403));
        }

        const updated = await updateMembership(groupId, userId, approve);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Remove member or leave (owner can remove others, user can remove self)
const removeGroupMember = async (req, res, next) => {
    try {
        const requesterId = req.user?.id;
        const { groupId, userId } = req.params;

        // If trying to remove someone else, must be owner
        if (parseInt(userId) !== requesterId) {
            const group = await getGroupById(groupId, requesterId);
            if (!group || group.groupowner !== requesterId) {
                return next(new ApiError("Only owner can remove other members", 403));
            }
        }

        const removed = await removeMember(groupId, userId);
        res.status(200).json(removed);
    } catch (err) {
        next(err);
    }
};

// Add movie (members only)
const addGroupMovie = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId } = req.params;
        const { tmdbid, movie } = req.body;
        if (!tmdbid || !movie) return next(new ApiError("tmdbid and movie required", 400));

        // Must be approved member
        const group = await getGroupById(groupId, userId);
        if (!group) return next(new ApiError("Not authorized", 403));

        const updated = await addMovieToGroup(groupId, tmdbid, movie);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Add screening (members only)
const addGroupScreening = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId } = req.params;
        const { screenTimeId } = req.body;
        if (!screenTimeId) return next(new ApiError("screenTimeId required", 400));

        // Must be approved member
        const group = await getGroupById(groupId, userId);
        if (!group) return next(new ApiError("Not authorized", 403));

        const added = await addScreeningToGroup(groupId, screenTimeId);
        res.status(201).json(added);
    } catch (err) {
        next(err);
    }
};

// List all pending join requests (only owner)
const listPendingRequests = async (req, res, next) => {
    try {
        const ownerId = req.user?.id;
        const { groupId } = req.params;

        // Ensure caller is the owner
        const group = await getGroupById(groupId, ownerId);
        if (!group || group.groupowner !== ownerId) {
            return next(new ApiError("Only the group owner can view pending requests", 403));
        }

        const requests = await getPendingRequests(groupId);
        res.status(200).json(requests);
    } catch (err) {
        next(err);
    }
};

// List all members of a group with roles
const listGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const members = await getAllGroupMembers(groupId);
        res.status(200).json(members);
    } catch (err) {
        next(err);
    }
};

// List all groups the logged-in user is part of
const listUserGroups = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));
        const groups = await getGroupsByUser(userId);
        res.status(200).json(groups);
    } catch (err) {
        next(err);
    }
};

export {
    createGroupController,
    listGroups,
    getGroupDetails,
    deleteGroup,
    joinGroup,
    handleJoinRequest,
    removeGroupMember,
    addGroupMovie,
    addGroupScreening,
    listPendingRequests,
    getGroupMembership,
    listGroupMembers,
    listUserGroups,
};
