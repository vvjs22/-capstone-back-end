const express = require("express");
const live = express.Router();
const moment = require("moment");
const {
  saveLiveVideo,
  getAllLiveVideos,
  getVideosByEventID,
} = require("../queries/live");
// const token = require("../100ms/token");

require("dotenv").config();

const { APIService } = require("../100ms/APIService");
const { TokenService } = require("../100ms/TokenService");

const tokenService = new TokenService();
const apiService = new APIService(tokenService);

live.get("/", async (req, res) => {
  try {
    const videos = await getAllLiveVideos();
    console.log(videos);
    res.json(videos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

live.get("/:eventID", async (req, res) => {
  const { eventID } = req.params;
  try {
    const videos = await getVideosByEventID(eventID);
    console.log(videos);
    res.json(videos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Create a new room, either randomly or with the requested configuration
live.post("/create-room", async (req, res) => {
  //   const payload = {
  //     name: req.body.name,
  //     description: req.body.description,
  //     template_id: req.body.template_id,
  //     region: req.body.region,
  //   };

  try {
    // const roomData = await apiService.post("/rooms",payload);
    const { event_id, streamer_user_id } = req.body;
    const roomData = await apiService.post("/rooms");
    const roomID = await roomData.id;
    console.log("roomID", roomID);
    const roomCodes = await apiService.post("/room-codes/room/" + roomID);
    console.log("room Codes", roomCodes);
    const broadcasterCode =
      roomCodes.data[0].role == "broadcaster"
        ? roomCodes.data[0].code
        : roomCodes.data[1].code;
    const viewerCode =
      roomCodes.data[0].role == "broadcaster"
        ? roomCodes.data[1].code
        : roomCodes.data[0].code;

    const live = {
      event_id,
      streamer_user_id,
      room_id: roomID,
      //   broadcaster_code: roomCodes.data[0].code,
      //   viewer_code: roomCodes.data[1].code,
      broadcaster_code: broadcasterCode,
      viewer_code: viewerCode,
    };
    console.log("live", live);
    const savedVideo = await saveLiveVideo(live);
    console.log("savedVideo", savedVideo);
    // res.json({ roomData, roomCodes });
    res.json(live);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Generate an auth token for a peer to join a room
live.post("/auth-token", (req, res) => {
  console.log(tokenService.getManagementToken());
  try {
    const token = tokenService.getAuthToken({
      room_id: req.body.room_id,
      user_id: req.body.user_id,
      role: req.body.role,
    });
    res.json({
      token: token,
      msg: "Token generated successfully!",
      success: true,
    });
  } catch (error) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get usage analytics for the latest Session in a Room
live.get("/session-analytics-by-room", async (req, res) => {
  try {
    const sessionListData = await apiService.get("/sessions", {
      room_id: req.query.room_id,
    });
    if (sessionListData.data.length > 0) {
      const sessionData = sessionListData.data[0];
      console.log(sessionData);

      // Calculate individual participants' duration
      const peers = Object.values(sessionData.peers);
      const detailsByUser = peers.reduce((acc, peer) => {
        const duration = moment
          .duration(moment(peer.left_at).diff(moment(peer.joined_at)))
          .asMinutes();
        const roundedDuration = Math.round(duration * 100) / 100;
        acc[peer.user_id] = {
          name: peer.name,
          user_id: peer.user_id,
          duration: (acc[peer.user_id] || 0) + roundedDuration,
        };
        return acc;
      }, {});
      const result = Object.values(detailsByUser);
      console.log(result);

      // Calculate aggregated participants' duration
      const totalDuration = result
        .reduce((a, b) => a + b.duration, 0)
        .toFixed(2);
      console.log(`Total duration for all peers: ${totalDuration} minutes`);

      // Calculate total session duration
      const sessionDuration = moment
        .duration(
          moment(sessionData.updated_at).diff(moment(sessionData.created_at))
        )
        .asMinutes()
        .toFixed(2);
      console.log(`Session duration is: ${sessionDuration} minutes`);

      res.json({
        user_duration_list: result,
        session_duration: sessionDuration,
        total_peer_duration: totalDuration,
      });
    } else {
      res.status(404).send("No session found for this room");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get the list of all sessions in a room
live.get("/session-list-by-room", async (req, res) => {
  try {
    let allSessions = [];
    let last;
    while (true) {
      const filters = { room_id: req.query.room_id, limit: 20 };
      // Check if we have a `last` value from the previous iteration
      if (last) {
        // If yes, set it as the `start` value for the next iteration
        filters.start = last;
      }
      // Get the list of sessions
      const someSessionListData = await apiService.get("/sessions", filters);
      // If there are no more sessions: break
      if (!someSessionListData.data || someSessionListData.data.length == 0) {
        break;
      }
      allSessions = allSessions.push(someSessionListData.data);
      // If there are less than `limit` sessions, no need to iterate again: break
      if (someSessionListData.data.length < 20) break;
      // Set the `last` value for the next iteration
      last = someSessionListData.last;
    }
    res.json(allSessions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = live;
