import { FC, ReactNode } from "react";

interface CommonPageProps {
  title: string;
  search: ReactNode;
  filter: ReactNode;
  avatar: ReactNode;
  backgroundImage: ReactNode;
  tabs: ReactNode;
  navCategory: ReactNode;
}

const CommonPageLayout: FC<CommonPageProps> = ({
  avatar,
  backgroundImage,
  filter,
  search,
  navCategory,
  tabs,
  title,
}) => {
  return (
    <div className="w-full flex">
      <div className="h-full basis-3/12 bg-white border-l border-r">
        <div className="flex flex-col h-screen">
          <div className="flex flex-col justify-center items-start basis-2/12 border-b px-4">
            <h4 className="text-lg text-gray-900 font-medium pb-2">{title}</h4>
            <div className="flex flex-row">
              {search}
              {filter}
            </div>
          </div>
          <div className="flex overflow-y-scroll justify-center items-start basis-full border-b">
            {navCategory}
          </div>
        </div>
      </div>
      <div className="h-full basis-9/12 bg-white">
        <div className="flex flex-col h-screen">
          <div className="flex relative justify-left items-center basis-2/12 border-b ">
            {backgroundImage}
            <div className="relative z-10 top-16 left-10">{avatar}</div>
          </div>
          <div className="flex justify-left items-start h-full border-b">
            {tabs}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonPageLayout;
