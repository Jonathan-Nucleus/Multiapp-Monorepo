export const getVideoIdFromYoutubeLink = (url: string) => {
  var video_id = url.split("v=")[1];
  var ampersandPosition = video_id.indexOf("&");
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id;
};
export const isValidYoutubeUrl = (url: string) => {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.trim().match(p)) {
    return true;
  }
  return false;
};
