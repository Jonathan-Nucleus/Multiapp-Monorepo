import { PostCategory } from "backend/graphql/posts.graphql";
import { PostCategories } from "backend/graphql/enumerations.graphql";
import {
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from "react-hook-form";
import * as yup from "yup";

import Checkbox from "../../../../common/Checkbox";
import Label from "../../../../common/Label";

const categories = Object.keys(PostCategories).sort();
export const categoriesSchema = yup
  .array()
  .of(yup.mixed().oneOf<PostCategory>(Object.keys(PostCategories)).required())
  .required()
  .default([])
  .min(1);

type CategorySelectorProps<TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  error?: string;
};

function CategorySelector<TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>>({
  error,
  ...controllerProps
}: CategorySelectorProps<TFieldValues, TName>) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-white/[.6] p-4 border-t md:border-t-0 border-b border-white/[.12]">
        <div className="text-sm">Categories</div>
        <div className="text-xs mt-2">
          Select categories to make your post easier to find and visible to more
          people.
        </div>
        {error &&
          <div className="text-xs text-error mt-2">
            {error}
          </div>
        }
      </div>
      <div className="py-2 min-h-0 overflow-y-auto">
        <Controller
          {...controllerProps}
          render={({ field }) => (
            <>
              {categories.map((category) => (
                <div
                  key={PostCategories[category]}
                  className="flex items-center px-4 py-2"
                >
                  <Checkbox
                    id={`category-${PostCategories[category]}`}
                    checked={field.value.includes(category)}
                    onChange={() => {
                      const { value } = field;
                      const _value = [...value];
                      value.includes(category)
                        ? _value.splice(value.indexOf(category), 1)
                        : _value.push(category);

                      field.onChange(_value);
                    }}
                  />
                  <Label
                    htmlFor={`category-${PostCategories[category]}`}
                    className="text-sm ml-3"
                  >
                    {PostCategories[category]}
                  </Label>
                </div>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
}

export default CategorySelector;
