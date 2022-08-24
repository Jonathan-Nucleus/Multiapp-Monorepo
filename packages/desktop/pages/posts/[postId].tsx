import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../../app/types/next-page";
import { usePost } from "shared/graphql/query/post/usePost";
import PostPage from "../../app/components/templates/PostPage";

const Post: NextPageWithLayout = () => {
  const router = useRouter();
  const { postId } = router.query as Record<string, string>;
  const { data: { post } = {} } = usePost(postId);
  const title = "Prometheus";

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <PostPage post={post} />
    </div>
  );
};

Post.layout = "main";
Post.middleware = "auth";

export default Post;
