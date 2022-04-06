import { FC } from "react";
import Image from "next/image";
import { ThumbsUp, ChatCenteredText, DotsThreeVertical } from "phosphor-react";
import Logo from "shared/assets/images/background.png";
import Stock from "shared/assets/images/stock.png";
import SharedSvg from "shared/assets/images/shared.svg";

const PostDetail: FC = (props) => {
  return (
    <div className="bg-gray border border-dark rounded-md my-3">
      <div className="p-2">
        <div className="flex items-center">
          <Image
            src={Logo}
            width={56}
            height={56}
            className="rounded-full"
            alt=""
          />
          <div className="ml-2">
            <div>
              <span className="font-bold">Michael Jordan</span>
              <span className="uppercase text-xs text-sky-400 ml-1">
                Follow
              </span>
            </div>
            <div className="text-xs text-zinc-500	">
              CEO, National Basketball Association
            </div>
            <div className="text-xs text-zinc-500	">2 min</div>
          </div>
        </div>
        <div>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem?
        </div>
        <div className="flex flex-wrap mt-2">
          <div className="uppercase px-2 py-1 border rounded-full bg-dark border-dark mr-3">
            news
          </div>
          <div className="uppercase px-2 py-1 border rounded-full bg-dark border-dark mr-3">
            politics
          </div>
        </div>
      </div>
      <Image src={Stock} alt="" layout="responsive" />
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <ThumbsUp size={18} color="#9F9F9E" fill="#00AAE0" weight="fill" />
            <span className="text-sm ml-1">23</span>
          </div>
          <div className="flex items-center mx-4">
            <ChatCenteredText size={18} color="#9F9F9E" />
            <span className="text-sm ml-1">13</span>
          </div>
          <div className="flex items-center">
            <Image src={SharedSvg} width={18} alt="" />
            <span className="text-sm ml-1">4</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">23 Likes</span>
          <DotsThreeVertical size={20} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
