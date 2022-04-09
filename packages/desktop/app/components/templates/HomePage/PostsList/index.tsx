import { FC, useState } from "react";
import FilterDropdown from "./FilterDropdown";
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
    image:
      "https://as1.ftcdn.net/v2/jpg/02/42/27/42/1000_F_242274206_Z6r7HZ7e6gnqLth5AnyQUUyVFLrGZC1y.jpg",
    postedAt: "Mar 30",
    following: false,
    followers: 23,
    messages: 13,
    shares: 4,
    likes: 23,
  },
];

const PostsList: FC = () => {
  const [selectedTopics, setSelectedTopics] = useState(["All"]);
  const [selectedFrom, setSelectedFrom] = useState("Everyone");
  return (
    <>
      <FilterDropdown
        topics={selectedTopics}
        from={selectedFrom}
        onSelect={(topics, from) => {
          if (topics.length == 0) {
            topics.push("All")
          }
          setSelectedTopics(topics);
          setSelectedFrom(from);
        }}
      />
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

export default PostsList;
