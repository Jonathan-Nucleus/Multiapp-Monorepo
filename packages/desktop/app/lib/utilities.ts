/**
 * Generate the initials from the text of words.
 *
 * @param text
 * @param length
 */
export const getInitials = (text: string, length = 2): string => {
  const words = text.split(" ")
  const initials = words
    .map(word => word.trim().length > 0 ? word.trim()[0] : "")
    .join("");
  return initials.substring(0, Math.min(initials.length, length)).toUpperCase();
};
