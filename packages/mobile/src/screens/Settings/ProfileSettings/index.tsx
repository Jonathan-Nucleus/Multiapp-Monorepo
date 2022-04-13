import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { NavigationProp } from '@react-navigation/native';
import {
  CaretLeft,
  MagnifyingGlass,
  Gear,
  DotsThreeVertical,
  UserCirclePlus,
} from 'phosphor-react-native';
import {
  WHITE,
  BGDARK,
  PRIMARYSOLID7,
  GRAY100,
  PRIMARY,
  BLACK,
  BLUE400,
} from 'shared/src/colors';
import LinkedinSvg from 'shared/assets/images/linkedin.svg';
import TwitterSvg from 'shared/assets/images/twitter.svg';

import PHeader from '../../../components/common/PHeader';
import pStyles from '../../../theme/pStyles';
import { Body1, Body2, Body3 } from '../../../theme/fonts';
import PAppContainer from '../../../components/common/PAppContainer';
import PGradientButton from '../../../components/common/PGradientButton';
import PLabel from '../../../components/common/PLabel';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const user = {
  image:
    'https://img.freepik.com/free-vector/smiling-girl-avatar_102172-32.jpg',
  name: 'Michelle Jordan',
  type: 'PRO',
  position: 'CEO @ HedgeFunds ‘R’ Us',
  description:
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem?',
  following: 28,
  followers: 23,
  post: 23,
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  website: 'https://website.com',
  companies: [
    {
      uri: 'https://unsplash.it/400/400?image=1',
      name: 'Cartenna Capital LP',
      position: 'CEO',
      id: 1312,
    },
    {
      uri: 'https://unsplash.it/400/400?image=1',
      name: 'Cartenna Capital LP',
      position: 'CEO',
      id: 131222,
    },
  ],
};

const ProfileSettings: FC<RouterProps> = ({ navigation }) => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <View style={styles.company}>
          <View style={styles.leftItem}>
            <FastImage
              style={styles.companyAvatar}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <Text style={styles.label}>{item.position}</Text>
              <Text style={styles.companyName}>{item.name}</Text>
            </View>
          </View>
          <UserCirclePlus size={28} color={WHITE} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        containerStyle={styles.headerContainer}
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        rightIcon={<MagnifyingGlass size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log(1231)}
      />
      <PAppContainer style={styles.appContainer}>
        <View style={styles.content}>
          <View style={styles.item}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
                headers: { Authorization: 'someAuthToken' },
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.rightItem}>
              <Text style={styles.label}>{user.name}</Text>
              <Text style={styles.comment}>{user.type}</Text>
              <Text style={styles.comment}>{user.position}</Text>
            </View>
          </View>
          <Text style={styles.comment}>{user.description}</Text>
          <View style={styles.row}>
            <PGradientButton
              label="Edit Profile"
              onPress={() => console.log(11)}
              btnContainer={styles.editProfileBtn}
            />
            <TouchableOpacity>
              <DotsThreeVertical size={28} color={GRAY100} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.comment}>
              {user.followers} Followers | {user.following} Following |{' '}
              {user.post} Posts
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.social]}>
          <TouchableOpacity onPress={() => Linking.openURL(user.linkedin)}>
            <LinkedinSvg />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => Linking.openURL(user.twitter)}>
            <TwitterSvg />
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={() => Linking.openURL(user.website)}>
            <Text style={styles.website}>Website</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <PLabel label="This is my bio data where I will write something about myself firm with a multi-strategy hedge fund offering. It is one of the world`s largest alternative asset management... More" />
        </View>
        <FlatList
          data={user.companies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          horizontal={true}
          style={styles.flatList}
        />
      </PAppContainer>
    </SafeAreaView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  headerTitle: {
    ...Body1,
    color: WHITE,
  },
  headerContainer: {
    backgroundColor: BGDARK,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    paddingTop: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  appContainer: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rightItem: {
    marginLeft: 8,
  },
  label: {
    ...Body2,
    color: WHITE,
  },
  comment: {
    color: GRAY100,
    ...Body3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  editProfileBtn: {
    flex: 1,
    marginRight: 12,
    width: '100%',
  },
  editProfileTxt: {
    textAlign: 'center',
    color: PRIMARY,
    ...Body2,
  },
  website: {
    color: PRIMARY,
    ...Body3,
  },
  social: {
    paddingVertical: 8,
    borderTopColor: GRAY100,
    borderBottomColor: GRAY100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    elevation: 5,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.7,
    marginBottom: 24,
  },
  verticalLine: {
    height: 32,
    backgroundColor: GRAY100,
    width: 1,
    marginLeft: 40,
    marginRight: 20,
  },
  icon: {
    marginLeft: 20,
  },
  company: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: PRIMARYSOLID7,
    marginLeft: 16,
  },
  companyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  flatList: {
    marginTop: 24,
  },
  companyName: {
    color: BLUE400,
  },
  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
});
