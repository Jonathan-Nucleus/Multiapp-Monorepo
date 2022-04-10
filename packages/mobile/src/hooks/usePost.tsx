import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/post';

const usePost = () => {
  const { data, error, loading, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-first',
  });

  return {
    data,
    error,
    loading,
    refetch,
  };
};

export default usePost;
