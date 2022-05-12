export const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const NAME_PATTERN = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/i;
export const SSN_PATTERN = /^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/i;
export const ZIPCODE_PATTERN = /^[0-9]{5}(?:-[0-9]{4})?$/i;
export const PHONE_PATTERN = /^\d{3}-\d{3}-\d{4}$/i;
export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&.^]).{8,}$/;

export const tagSplit = (text: string): string[] => {
  const splits = ` ${text}`.split(/(\W[\$|#]\w+)/g);

  let processedSplits: string[] = [];
  splits.forEach((val, index) => {
    if (val === "") return;

    const secondChar = val.charAt(1);
    if (secondChar === "$" || secondChar === "#") {
      if (index === 1) {
        processedSplits.pop();
      } else if (index > 1) {
        processedSplits[processedSplits.length - 1] += val.charAt(0);
      }

      processedSplits.push(val.substring(1));
      return;
    }

    processedSplits.push(val);
  });

  return processedSplits;
};
