import React, { useState, useEffect, memo, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import isEqual from 'react-fast-compare';
import SplashScreen from 'react-native-splash-screen';
import { useIsFocused } from '@react-navigation/native';

import {
  BellSlash,
  EyeClosed,
  UserCirclePlus,
  WarningOctagon,
} from 'phosphor-react-native';

import PAppContainer from '../../components/common/PAppContainer';
import MainHeader from '../../components/main/Header';
import SelectionModal from '../../components/common/SelectionModal';
import pStyles from '../../theme/pStyles';
import PostItem, { PostItemProps } from '../../components/main/PostItem';
import Tag from '../../components/common/Tag';
import PGradientButton from '../../components/common/PGradientButton';
import ReportPostModal from './ReportPostModal';
import { HomeScreen } from 'mobile/src/navigations/HomeStack';
import { WHITE } from 'shared/src/colors';

import { useFetchPosts } from 'mobile/src/hooks/queries';
import { useAccount } from '../../graphql/query/account';
import { useFollowUser, useHideUser } from '../../graphql/mutation/account';
import { showMessage } from '../../services/utils';
import { SOMETHING_WRONG } from 'shared/src/constants';
import { useHidePost, useReportPost } from '../../graphql/mutation/posts';

const CategoryList = ['All', 'Investment Ideas', 'World News', 'Politics'];

const HomeComponent: HomeScreen = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const [kebobMenuVisible, setKebobMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [reportPostModalVisible, setReportPostModalVisible] = useState(false);

  const { data, error, loading, refetch } = useFetchPosts();
  const { data: userData } = useAccount();
  const [followUser] = useFollowUser();
  const [hideUser] = useHideUser();
  const [hidePost] = useHidePost();
  const [reportPost] = useReportPost();

  const account = userData?.account;
  const postData = data?.posts;

  const getKebobMenuData = useMemo(() => {
    const KebobMenuDataArray = [
      {
        label: `Follow ${selectedPost?.user?.firstName} ${selectedPost?.user?.lastName}`,
        icon: <UserCirclePlus size={32} color={WHITE} />,
        key: 'follow',
      },
      {
        label: 'Turn off notifications for this post',
        icon: <BellSlash size={26} color={WHITE} />,
        key: 'turnOff',
      },
      {
        label: 'Hide post',
        icon: <BellSlash size={26} color={WHITE} />,
        key: 'hidePost',
      },
      {
        label: 'Report post',
        icon: <WarningOctagon size={26} color={WHITE} />,
        key: 'report',
      },
      {
        label: `Hide ${selectedPost?.user?.firstName} ${selectedPost?.user?.lastName}`,
        icon: <EyeClosed size={32} color={WHITE} />,
        key: 'hide',
      },
    ];

    return KebobMenuDataArray;
  }, [selectedPost]);

  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);
  if (isFocused !== focusState) {
    // Refetch whenever the focus state changes to avoid refetching during
    // rerender cycles
    console.log('refetching...');
    refetch();
    setFocusState(isFocused);
  }

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const handleFollowUser = async () => {
    try {
      const { data } = await followUser({
        variables: { follow: true, userId: selectedPost.user._id },
      });
      if (data?.followUser) {
        showMessage(
          'success',
          `You’re following ${selectedPost?.user?.firstName} ${selectedPost?.user?.lastName}`,
        );
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleHideUser = async () => {
    try {
      const { data } = await hideUser({
        variables: { hide: true, userId: selectedPost.user._id },
      });
      if (data?.hideUser) {
        showMessage(
          'success',
          `You will not be able to see posts from ${selectedPost?.user?.firstName} ${selectedPost?.user?.lastName} anymore`,
        );
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleHidePost = async () => {
    try {
      const { data } = await hidePost({
        variables: { hide: true, postId: selectedPost._id },
      });
      if (data?.hidePost) {
        showMessage('info', 'You will not be able to see this post anymore.');
        refetch();
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleReportPost = async (violations: string[], comment: string) => {
    try {
      const { data } = await reportPost({
        variables: {
          report: {
            violations,
            comments: comment,
            postId: selectedPost._id,
          },
        },
      });

      if (data?.reportPost) {
        showMessage('info', 'Thanks for letting us know');
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const renderItem = ({ item }: { item: PostItemProps }) => (
    <PostItem
      post={item}
      userId={account?._id}
      onPressMenu={() => {
        setSelectedPost(item);
        setKebobMenuVisible(true);
      }}
    />
  );

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader />
      <PAppContainer style={styles.container}>
        <FlatList
          horizontal
          data={CategoryList}
          renderItem={({ item }) => (
            <Tag
              label={item}
              viewStyle={styles.tagStyle}
              textStyle={styles.tagLabel}
              isSelected={item === category}
              onPress={setCategory}
            />
          )}
          listKey="category"
        />
        <FlatList
          data={postData || []}
          renderItem={renderItem}
          keyExtractor={(item: PostItemProps) => `${item._id}`}
          listKey="post"
        />
      </PAppContainer>
      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.postLabel}
        onPress={handleCreatePost}
      />
      <SelectionModal
        isVisible={kebobMenuVisible}
        dataArray={getKebobMenuData}
        buttonLabel="Cancel"
        onPressCancel={() => setKebobMenuVisible(false)}
        onPressItem={(key) => {
          setKebobMenuVisible(false);
          if (key === 'follow') {
            handleFollowUser();
          } else if (key === 'hide') {
            handleHideUser();
          } else if (key === 'hidePost') {
            handleHidePost();
          } else if (key === 'report') {
            setTimeout(() => setReportPostModalVisible(true), 500);
          }
        }}
      />
      <ReportPostModal
        isVisible={reportPostModalVisible}
        onPressCancel={() => setReportPostModalVisible(false)}
        onPressConfirm={(violations, comment) => {
          handleReportPost(violations, comment);
          setReportPostModalVisible(false);
        }}
      />
    </View>
  );
};

export const Home = memo(HomeComponent, isEqual);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    borderRadius: 4,
  },
  tagLabel: {
    textTransform: 'none',
  },
  postButton: {
    position: 'absolute',
    bottom: 22,
    right: 22,
  },
  gradientContainer: {
    width: 56,
    height: 56,
    paddingVertical: 0,
  },
  postLabel: {
    fontSize: 40,
    textAlign: 'center',
  },
});
