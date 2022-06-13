export const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const NAME_PATTERN = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/i;
export const SSN_PATTERN = /^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/i;
export const ZIPCODE_PATTERN = /^[0-9]{5}(?:-[0-9]{4})?$/i;
export const PHONE_PATTERN = /^\d{3}-\d{3}-\d{4}$/i;
export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&.^]).{8,}$/;
export const LINK_PATTERN =
  /((?:(?:https|http|ftp):\/\/)?(?:www\.)?(?:[-a-zA-Z\d@:%._+~#=]{2,256}\.[a-z]{2,6}\b)+(?:\/[/\d\w.\-?=&%+#]+)?)/gim;
export const TAG_PATTERN = /(^|\W)([$|#]\D\w*)/gim;
export const MENTION_PATTERN =
  /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/gim;

export const POST_PATTERN = new RegExp(
  `${TAG_PATTERN.source}|${MENTION_PATTERN.source}|${LINK_PATTERN.source}`,
  "gim"
);

export const isWebLink = (link: string): boolean => {
  return !link.startsWith("mailto:");
};

export const hrefFromLink = (link: string): string => {
  if (!link.startsWith("http") && !link.startsWith("mailto:")) {
    return `https://${link}`;
  } else {
    return link;
  }
};

export const processPost = (text: string): string[] => {
  const splits = text.split(POST_PATTERN);

  const processedSplits: string[] = [];
  for (let index = 0; index < splits.length; index++) {
    const val = splits[index];
    if (!val || val === "") continue;

    if (val.startsWith("@[")) {
      processedSplits.push(`@${splits[index + 2]}|${splits[index + 4]}`);
      index += 5;
    } else if (val.trim().length > 0 && val.match(LINK_PATTERN)) {
      processedSplits.push(`%%${val}`);
    } else {
      processedSplits.push(val);
    }
  }

  return processedSplits;
};
