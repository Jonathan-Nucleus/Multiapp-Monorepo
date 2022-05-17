import { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import { MagnifyingGlass } from "phosphor-react";
import Link from "next/link";
import {
  SearchType,
  SearchTypeOptions,
} from "../../../../../templates/SearchPage";
import Avatar from "../../../../../common/Avatar";

type User = GlobalSearchData["globalSearch"]["users"][number];
type Company = GlobalSearchData["globalSearch"]["companies"][number];
// type Post = GlobalSearchData["globalSearch"]["posts"][number];
type Fund = GlobalSearchData["globalSearch"]["funds"][number];

export type ItemType = {
  type: SearchType,
  value?: {
    user?: User,
    company?: Company,
    fund?: Fund
  };
}

interface SearchItemProps {
  item: ItemType;
  keyword: string;
}

const SearchItem: FC<SearchItemProps> = ({
  item,
  keyword,
}: SearchItemProps) => {
  return (
    <>
      <div className="cursor-pointer hover:bg-primary-overlay/[.12] px-4 py-2">
        {!item.value &&
          <Link href={`/search/${SearchTypeOptions[item.type].route}?query=${keyword}`}>
            <a>
              <div className="flex items-center">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-gray-400 text-gray-400">
                  <MagnifyingGlass
                    color="currentColor"
                    size={24}
                  />
                </div>
                <div className="min-w-0 font-semibold truncate ml-2">
                  {keyword}
                </div>
                <div className="flex-shrink-0 italic text-gray-400 ml-2">
                  {`in ${SearchTypeOptions[item.type].title}`}
                </div>
              </div>
            </a>
          </Link>
        }
        {item.value?.user &&
          <Link href={`/profile/${item.value.user._id}`}>
            <a>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar user={item.value.user} size={32} />
                </div>
                <div className="min-w-0 font-semibold truncate ml-2">
                  {item.value.user.firstName} {item.value.user.lastName}
                </div>
                <div className="flex-shrink-0 italic text-gray-400 ml-2">
                  Person
                </div>
              </div>
            </a>
          </Link>
        }
        {item.value?.company &&
          <Link href={`/company/${item.value.company._id}`}>
            <a>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar user={item.value.company} size={32} />
                </div>
                <div className="min-w-0 font-semibold truncate ml-2">
                  {item.value.company.name}
                </div>
                <div className="flex-shrink-0 italic text-gray-400 ml-2">
                  Company
                </div>
              </div>
            </a>
          </Link>
        }
        {item.value?.fund &&
          <Link href={`/funds/${item.value.fund._id}`}>
            <a>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar user={item.value.fund.company} size={32} />
                </div>
                <div className="min-w-0 font-semibold truncate ml-2">
                  {item.value.fund.name}
                </div>
                <div className="flex-shrink-0 italic text-gray-400 ml-2">
                  Fund
                </div>
              </div>
            </a>
          </Link>
        }
      </div>
    </>
  );
};

export default SearchItem;
