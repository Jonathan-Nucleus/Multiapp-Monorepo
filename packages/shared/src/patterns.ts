export const passwordRequirements = [
  {
    label: "Upper and lower case",
    pattern: /(?=.*[a-z])(?=.*[A-Z])/,
  },
  {
    label: "Numbers",
    pattern: /(?=.*\d)/,
  },
  {
    label: "Special characters (ex: @$!%*?&.^#)",
    pattern: /(?=.*[@$!%*?&.^#])/,
  },
  {
    label: "8+ characters",
    pattern: /.{8,}/,
  },
];
export const PASSWORD_PATTERN = new RegExp(
  `^${passwordRequirements
    .map((requirement) => requirement.pattern.source)
    .join("")}$`
);

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

export const parseMentions = (text: string): string[] => {
  const matches = Array.from(text.matchAll(MENTION_PATTERN)).map(
    (match) => match[5]
  );
  return matches;
};
