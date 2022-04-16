import { forwardRef, HTMLProps } from "react";

type SearchInputProps = HTMLProps<HTMLInputElement>;
const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      className={`rounded-full bg-black shadow-sm shadow-inner block w-full
          leading-7 border border-gray-800 focus-visible:outline-none px-4
          py-1 text-white text-xs h-10 mt-0.5 placeholder-opacity-40 placeholder-white ${props.className}`}
    />
  )
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
