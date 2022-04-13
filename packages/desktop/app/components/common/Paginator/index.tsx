import { FC } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import Button from "../Button";

interface PaginatorProps {
  current: number;
  total: number;
  visible?: number;
  onSelect: (page: number) => void;
}

type Segment = number | "ellipsis";

const Paginator: FC<PaginatorProps> = ({
  current = 1,
  total = 1,
  visible = 5,
  onSelect,
}: PaginatorProps) => {
  const segments: Segment[] = [];
  let startPage = Math.max(
    Math.min(current - Math.floor(visible / 2), total - visible + 1),
    1
  );
  let endPage = Math.min(startPage + visible - 1, total);
  if (startPage != 1) {
    segments.push("ellipsis");
  }
  for (let i = startPage; i <= endPage; i++) {
    segments.push(i);
  }
  if (endPage != total) {
    segments.push("ellipsis");
    segments.push(total);
  }
  return (
    <>
      <div className="flex items-center">
        <div>
          <Button
            variant="text"
            className="text-primary disabled:text-white/[.38]"
            disabled={current == 1}
            onClick={() => onSelect(current - 1)}
          >
            <CaretLeft color="currentColor" size={24} />
          </Button>
        </div>
        <div className="flex items-center">
          {segments.map((segment, index) => (
            <div key={index} className="px-1">
              {segment == "ellipsis" ? (
                <div className="w-8 text-white flex items-center justify-center">
                  ...
                </div>
              ) : (
                <>
                  <Button
                    variant="text"
                    className={
                      "w-8 h-8 flex items-center justify-center rounded-full text-sm text-white tracking-normal " +
                      (current == segment ? "bg-white/[.25]" : "")
                    }
                    onClick={() => onSelect(segment)}
                  >
                    {segment}
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
        <div>
          <Button
            variant="text"
            className="text-primary disabled:text-white/[.38]"
            disabled={current == total}
            onClick={() => onSelect(current + 1)}
          >
            <CaretRight color="currentColor" size={24} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Paginator;
