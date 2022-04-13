import {
  AudienceOptions,
  AudienceEnum,
  PostCategoryOptions,
  PostCategoryEnum,
} from "../schemas/post";

export const Audiences = Object.keys(AudienceOptions);
export const PostCategories = Object.keys(PostCategoryOptions).reduce(
  (acc, category) => {
    acc[category] = PostCategoryOptions[category].label;
    return acc;
  },
  {} as Record<PostCategoryEnum, string>
);
