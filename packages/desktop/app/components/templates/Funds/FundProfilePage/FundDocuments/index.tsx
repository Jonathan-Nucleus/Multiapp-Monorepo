import { FC, useMemo, useState } from "react";
import Card from "../../../../common/Card";
import Image from "next/image";
import RecentDoc from "shared/assets/images/recent-doc.svg";
import dayjs from "dayjs";
import {
  DocumentCategories,
  FundDetails,
} from "shared/graphql/query/marketplace/useFund";
import { File } from "phosphor-react";
import Button from "../../../../common/Button";
import { useDocumentToken } from "shared/graphql/query/account/useDocumentToken";
import getConfig from "next/config";

interface FundDocumentsProps {
  fundId: string;
  documents: FundDetails["documents"];
}

const { publicRuntimeConfig = {} } = getConfig();
const { NEXT_PUBLIC_WATERMARKING_SERVICE_URL } = publicRuntimeConfig;

const FundDocuments: FC<FundDocumentsProps> = ({ fundId, documents }) => {
  const [showMore, setShowMore] = useState(false);
  const [fetchDocumentToken] = useDocumentToken();
  const documentsSorted = useMemo(() => {
    return documents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [documents]);
  const categoryDocuments = useMemo(() => {
    return DocumentCategories.map((category) => {
      return {
        category: category.label,
        documents: documentsSorted.filter(
          (item) => item.category == category.value
        ),
      };
    }).filter((item) => item.documents.length > 0);
  }, [documentsSorted]);
  const goToFile = async (url: string): Promise<void> => {
    try {
      const { data } = await fetchDocumentToken({
        variables: {
          fundId: fundId,
          document: url,
        },
      });

      if (data && data.documentToken) {
        window.open(`${NEXT_PUBLIC_WATERMARKING_SERVICE_URL}?token=${data.documentToken}`);
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
    }
  };
  return (
    <>
      <div>
        <div className="text-xl text-white font-medium">Recently Added</div>
        <div className="mt-3">
          {documentsSorted.slice(0, 2)?.map((doc) => (
            <div key={doc.url} className="mb-3">
              <Card
                className="p-0 cursor-pointer"
                onClick={() => goToFile(doc.url)}
              >
                <div className="flex items-center">
                  <div className="w-32 h-24 flex bg-gray-300 relative items-center justify-center">
                    <Image src={RecentDoc} alt="" />
                  </div>
                  <div className="ml-5">
                    <div className="text-white">{doc.title}</div>
                    <div className="text-white opacity-60">
                      {dayjs(doc.date).format("MMMM D, YYYY h:mmA")}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {categoryDocuments.map((category, index) => (
        <div key={index} className="mt-10">
          <div className="text-xl text-white font-medium">
            {category.category}
          </div>
          <div className="border-white/[.12] divide-y divide-inherit mt-5">
            {category.documents.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex py-5 cursor-pointer"
                onClick={() => goToFile(item.url)}
              >
                <div className="text-white">
                  <File color="currentColor" size={24} />
                </div>
                <div className="ml-3">
                  <div className="text-white">{item.title}</div>
                  <div className="text-xs text-white/[0.6] mt-1 tracking-wider">
                    {dayjs(item.date).format("MMMM D, YYYY h:mmA")}
                  </div>
                </div>
              </div>
            ))}
            {showMore &&
              category.documents.slice(5).map((item, index) => (
                <div
                  key={index}
                  className="flex py-5 cursor-pointer"
                  onClick={() => goToFile(item.url)}
                >
                  <div className="text-white">
                    <File color="currentColor" size={24} />
                  </div>
                  <div className="ml-3">
                    <div className="text-white">{item.title}</div>
                    <div className="text-xs text-white/[0.6] mt-1 tracking-wider">
                      {dayjs(item.date).format("MMMM D, YYYY h:mmA")}
                    </div>
                  </div>
                </div>
              ))}
            {category.documents.length > 5 && (
              <div className="py-5">
                <Button
                  variant="text"
                  className="text-primary font-medium"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore
                    ? `Less ${category.category}`
                    : `More ${category.category}`}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default FundDocuments;
