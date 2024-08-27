const Chat = require("../models/chat");
const User = require("../models/user");
const Request = require("../models/request");
const { emitEvent } = require("../utils/fetueres");
const { NEW_REQUEST, REFETCH_CHAT } = require("../constants/events");

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    return res.status(200).json({
      success: true,
      messeage: "Profile fetched successfully",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in profile fatching",
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { name = "" } = req.query;

    const mychats = await Chat.find({ groupChat: false, members: req.userId });

    const allUserFromMyChats = mychats.flatMap((chat) => chat.members);

    const allUserExpectMeAndFrainds = await User.find({
      _id: { $nin: allUserFromMyChats },
      name: { $regex: name, $options: "i" },
    });

    const users = allUserExpectMeAndFrainds.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      messeage: "user serched successfully",
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in searching user",
    });
  }
};

exports.sendFraindRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "UserId is required",
      });
    }

    const request = await Request.findOne({
      $or: [
        { sender: userId, reciver: req.userId },
        { sender: req.userId, reciver: userId },
      ],
    });

    if (request) {
      return res.status(404).json({
        success: false,
        message: "request alredy sent",
      });
    }

    await Request.create({
      sender: req.userId,
      reciver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
      success: true,
      message: "request send",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in sending fraind request",
    });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId, accept } = req.body;

    if (!requestId) {
      return res.status(404).json({
        success: false,
        message: "requestId  is required",
      });
    }

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("reciver", "name");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "request not found",
      });
    }

    if (request.reciver._id.toString() !== req.userId.toString()) {
      return res.status(404).json({
        success: false,
        message: "you are not authorized to accept this requst",
      });
    }

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "fraind request rejected",
      });
    }

    const members = [request.sender._id, request.reciver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.reciver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHAT, members);

    return res.status(200).json({
      success: true,
      message: "Fraind request accpet",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in accepting request",
    });
  }
};

exports.getAllNotifaction = async (req, res) => {
  try {
    const requests = await Request.find({ reciver: req.userId }).populate(
      "sender",
      "name avatar"
    );

    const allRequest = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      message: "all requests",
      allRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in get my frainds",
    });
  }
};

exports.getMyFrainds = async (req, res) => {
  try {
    const chatId = req.query.chatId;

    const chats = await Chat.find({
      members: req.userId,
      groupChat: false,
    }).populate("members", "name avatar");

    const frainds = chats.map(({ members }) => {
      const otherUser = members.filter(
        (member) => member._id.toString() !== req.userId.toString()
      );

      return {
        _id: otherUser[0]._id,
        name: otherUser[0].name,
        avatar: otherUser[0].avatar,
      };
    });

    if (chatId) {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "this is not vallied chat id",
        });
      }

      const availableFrainds = frainds.filter(
        (fraind) => !chat.members.includes(fraind._id)
      );

      return res.status(200).json({
        success: true,
        frainds: availableFrainds,
      });
    } else {
      return res.status(200).json({
        success: false,
        frainds,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "error occured in get my frainds",
    });
  }
};

