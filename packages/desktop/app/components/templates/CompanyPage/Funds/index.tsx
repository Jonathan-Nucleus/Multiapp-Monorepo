import { FC, useState } from "react";
import Post from "../../../common/Post";

const posts = [
  {
    user: {
      image:
        "https://img.freepik.com/free-vector/smiling-girl-avatar_102172-32.jpg",
      name: "Michelle Jordan",
      type: "PRO",
      position: "CEO @ HedgeFunds ‘R’ Us",
    },
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem?",
    topics: ["news", "politics"],
    postedAt: "Mar 30",
    following: false,
    followers: 23,
    messages: 13,
    shares: 4,
  },
];

const Funds: FC = () => {
  return (
    <>
      <div className="flex items-center">
        <div className="text-white mb-2 mt-3">Funds</div>
      </div>
      <div>
        {posts.map((post, index) => (
          <div key={index} className="mt-4 mb-4">
            <Post post={post} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Funds;
