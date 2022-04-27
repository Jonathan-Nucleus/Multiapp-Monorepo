import React, { FC, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  CaretLeft,
  Camera,
  Image as ImagePhoto,
  Trash,
} from 'phosphor-react-native';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';
import ImagePicker from 'react-native-image-crop-picker';
const Buffer = global.Buffer || require('buffer').Buffer;

import {
  WHITE,
  PRIMARYSOLID,
  WHITE12,
  WHITE60,
  PRIMARY,
} from 'shared/src/colors';
import pStyles from '../../../../theme/pStyles';
import { Body1Bold, Body2, Body2Bold, H5Bold } from '../../../../theme/fonts';
import MainHeader from '../../../../components/main/Header';
import PAppContainer from '../../../../components/common/PAppContainer';
import type { User } from 'backend/graphql/users.graphql';
import { useUpdateUserProfile } from 'mobile/src/graphql/mutation/account';
import { useFetchUploadLink } from 'mobile/src/graphql/mutation/posts';
import { showMessage } from '../../../../services/utils';
import PGradientButton from '../../../../components/common/PGradientButton';
import { MediaType } from 'backend/graphql/mutations.graphql';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const EditPhoto: FC<RouterProps> = ({ navigation, route }) => {
  const [imageData, setImageData] = useState<any>({});
  const user: User = useMemo(() => {
    return route.params?.user;
  }, [route]);
  const [updateUserProfile] = useUpdateUserProfile();
  const [fetchUploadLink] = useFetchUploadLink();

  const openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      setImageData(image);
    });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      setImageData(image);
    });
  };

  const updatePhoto = async () => {
    const type: MediaType = route.params?.type;

    try {
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: imageData?.filename,
          type: type,
        },
      });

      if (!data || !data.uploadLink) {
        showMessage('error', 'Image upload failed');
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      const buf = new Buffer(
        imageData.data.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
      await fetch(uploadUrl, {
        method: 'PUT',
        body: buf,
      });

      if (type === 'AVATAR') {
        const profile = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: remoteName,
        };
        await updateUserProfile({
          variables: {
            profile,
          },
        });
      }

      if (type === 'BACKGROUND') {
        const profile = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          background: {
            url: remoteName,
            width: 500,
            height: 200,
            x: 0,
            y: 0,
            scale: 2,
          },
        };
        await updateUserProfile({
          variables: {
            profile,
          },
          refetchQueries: ['Account'],
        });
      }

      showMessage('success', 'Profile photo is updated.');
      navigation.goBack();
    } catch (err) {
      console.log('upload error=====>', err);
      showMessage('error', (err as Error).message);
    } finally {
      setImageData(null);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={<CaretLeft color={WHITE} />}
        centerIcon={
          <Text style={styles.header}>
            {route.params?.type === 'AVATAR'
              ? 'Edit Profile Photo'
              : 'Edit Cover Photo'}
          </Text>
        }
        rightIcon={
          <TouchableOpacity onPress={updatePhoto} disabled={!imageData}>
            <Text style={[styles.save, imageData && styles.active]}>Save</Text>
          </TouchableOpacity>
        }
        onPressLeft={() => navigation.goBack()}
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
        <View style={styles.content}>
          {route.params?.type === 'AVATAR' ? (
            imageData?.path ? (
              <FastImage
                style={styles.avatar}
                source={{
                  uri: imageData.path,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : user?.avatar ? (
              <FastImage
                style={styles.avatar}
                source={{
                  uri: `${AVATAR_URL}/${user?.avatar}`,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.noAvatarContainer}>
                <Text style={styles.noAvatar}>
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </Text>
              </View>
            )
          ) : imageData?.path ? (
            <FastImage
              style={styles.cover}
              source={{
                uri: imageData.path,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : user?.background?.url ? (
            <FastImage
              style={styles.cover}
              source={{
                uri: `${BACKGROUND_URL}/${user?.background.url}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <PGradientButton
              btnContainer={styles.noBackground}
              gradientContainer={styles.gradientContainer}
            />
          )}
        </View>
      </PAppContainer>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={takePhoto}>
          <View style={styles.item}>
            <Camera size={24} color={WHITE} />
            <Text style={styles.label}>Take New Photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openPicker}>
          <View style={styles.item}>
            <ImagePhoto size={24} color={WHITE} />
            <Text style={styles.label}>Upload from Photos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setImageData(null)}>
          <View style={styles.item}>
            <Trash size={24} color={WHITE} />
            <Text style={styles.label}>Delete Photo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPhoto;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...Body1Bold,
    color: WHITE,
  },
  save: {
    color: WHITE60,
    ...Body2,
  },
  active: {
    color: PRIMARY,
  },
  content: {
    marginTop: 34,
    alignSelf: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingVertical: 19,
    borderTopColor: WHITE12,
    borderTopWidth: 1,
  },
  label: {
    marginLeft: 20,
    ...Body2Bold,
    color: WHITE,
  },
  noAvatarContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAvatar: {
    color: PRIMARYSOLID,
    ...H5Bold,
  },
  bottom: {
    marginBottom: 40,
  },
  noBackground: {
    height: 65,
  },
  gradientContainer: {
    borderRadius: 0,
    height: 65,
  },
  cover: {
    height: 65,
    width: Dimensions.get('screen').width,
  },
});
