import Group from '../models/Group.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creator = req.user._id;

    const group = new Group({
      name,
      description,
      creator,
      members: [creator],
      admins: [creator],
    });

    await group.save();

    const conversation = new Conversation({
      participants: [creator],
      groupId: group._id,
    });

    await conversation.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group creator can delete the group' });
    }

    const conversation = await Conversation.findOne({ groupId });
    if (conversation) {
      await Message.deleteMany({ conversationId: conversation._id });
      await conversation.deleteOne();
    }

    await group.deleteOne();
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.admins.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    group.members.addToSet(userId);
    await group.save();

    const conversation = await Conversation.findOne({ groupId });
    conversation.participants.addToSet(userId);
    await conversation.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.admins.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (group.creator.toString() === userId) {
      return res.status(403).json({ message: 'Cannot remove group creator' });
    }

    group.members.pull(userId);
    group.admins.pull(userId);
    await group.save();

    const conversation = await Conversation.findOne({ groupId });
    conversation.participants.pull(userId);
    await conversation.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('members', 'username fullName profilePic')
      .populate('admins', 'username fullName profilePic')
      .populate('creator', 'username fullName profilePic');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};