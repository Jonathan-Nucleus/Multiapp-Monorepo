export const getVideoIdFromYoutubeLink = (url: string): string | undefined => {
  const idPattern =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(idPattern);
  return match && match[2].length === 11 ? match[2] : undefined;
};

export const isValidYoutubeUrl = (url: string): boolean => {
  const urlPattern =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return !!url.trim().match(urlPattern);
};
