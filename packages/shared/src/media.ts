const VIDEO_EXTENSIONS = ["mp4"];

export type MediaType = "video" | "audio" | "image" | undefined;

export const getMediaTypeFrom = (url: string): MediaType => {
  let fileUrl = url;
  const queryIndex = url.indexOf("?");
  if (queryIndex != -1) {
    fileUrl = url.substring(0, queryIndex);
  }
  const extension = fileUrl
    .toLowerCase()
    .substring(fileUrl.lastIndexOf(".") + 1);
  if (VIDEO_EXTENSIONS.includes(extension)) {
    return "video";
  } else {
    return "image";
  }
};
