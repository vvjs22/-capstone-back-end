const db = require("../happndb/dbConfig");

const saveLiveVideo = async (live) => {
  const { event_id, room_id, broadcaster_code, viewer_code, streamer_user_id } =
    live;
  const savedLive = await db.any(
    'INSERT INTO "Live_video" (event_id,streamer_user_id,room_id,broadcaster_code,viewer_code) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [event_id, streamer_user_id, room_id, broadcaster_code, viewer_code]
  );
  return savedLive;
};

module.exports = { saveLiveVideo };
