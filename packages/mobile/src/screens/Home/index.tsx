import React, { useState, useEffect, memo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import isEqual from 'react-fast-compare';
import SplashScreen from 'react-native-splash-screen';
import { useIsFocused } from '@react-navigation/native';

import PAppContainer from '../../components/common/PAppContainer';
import pStyles from '../../theme/pStyles';
import FeedItem, { FeedItemProps } from './FeedItem';
import Tag from '../../components/common/Tag';
import PGradientButton from '../../components/common/PGradientButton';
import { HomeScreen } from 'mobile/src/navigations/HomeStack';
import usePost from '../../hooks/usePost';
import PHeader from '../../components/common/PHeader';
import PLabel from '../../components/common/PLabel';
import RoundImageView from '../../components/common/RoundImageView';
import { H6 } from '../../theme/fonts';
import { BGHEADER } from 'shared/src/colors';
import { useFetchPosts } from 'mobile/src/hooks/queries';

import LogoSvg from 'shared/assets/images/logo-icon.svg';
import SearchSvg from 'shared/assets/images/search.svg';
import BellSvg from 'shared/assets/images/bell.svg';
import Avatar from '../../assets/avatar.png';

const CategoryList = ['All', 'Investment Ideas', 'World News', 'Politics'];

const HomeComponent: HomeScreen = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const { data, error, loading, refetch } = useFetchPosts();
  const postData = data?.posts;

  const isFocused = useIsFocused();
  const [focusState, setFocusState] = useState(isFocused);
  if (isFocused != focusState) {
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

  const renderItem = ({ item }: { item: FeedItemProps }) => (
    <FeedItem post={item} />
  );

  return (
    <View style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <View style={styles.headerLogoContainer}>
            <LogoSvg />
            <PLabel
              label="Prometheus"
              textStyle={styles.logoText}
              viewStyle={styles.logoTextWrapper}
            />
          </View>
        }
        rightIcon={
          <View style={styles.headerIconContainer}>
            <SearchSvg />
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}>
              <BellSvg style={styles.headerIcon} />
            </TouchableOpacity>
            <RoundImageView image={Avatar} imageStyle={styles.avatarImage} />
          </View>
        }
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
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
          keyExtractor={(item: FeedItemProps) => `${item._id}`}
          listKey="feed"
        />
      </PAppContainer>
      <PGradientButton
        label="+"
        btnContainer={styles.postButton}
        gradientContainer={styles.gradientContainer}
        textStyle={styles.postLabel}
        onPress={handleCreatePost}
      />
    </View>
  );
};

export const Home = memo(HomeComponent, isEqual);

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: BGHEADER,
    marginBottom: 16,
  },
  headerLogoContainer: {
    flexDirection: 'row',
  },
  logoTextWrapper: {
    marginLeft: 8,
  },
  logoText: {
    ...H6,
  },
  headerIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginHorizontal: 20,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
