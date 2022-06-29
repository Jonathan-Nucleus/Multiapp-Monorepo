import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  CaretLeft,
  Camera,
  Image as ImagePhoto,
  Trash,
} from 'phosphor-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
const Buffer = global.Buffer || require('buffer').Buffer;

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { showMessage } from 'mobile/src/services/ToastService';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold } from 'mobile/src/theme/fonts';
import { WHITE, WHITE12, WHITE60, PRIMARY } from 'shared/src/colors';

import { useAccountContext } from 'shared/context/Account';
import { useUpdateUserProfile } from 'shared/graphql/mutation/account';
import { useFetchUploadLink } from 'shared/graphql/mutation/posts';

import { EditUserPhotoScreen } from 'mobile/src/navigations/UserDetailsStack';
import Avatar from '../../components/common/Avatar';

import { S3_BUCKET } from 'react-native-dotenv';

const EditPhoto: EditUserPhotoScreen = ({ navigation, route }) => {
  const { type } = route.params;

  const user = useAccountContext();
  const [updateUserProfile] = useUpdateUserProfile();
  const [fetchUploadLink] = useFetchUploadLink();
  const [imageData, setImageData] = useState<any>({});

  const aspect =
    type === 'AVATAR'
      ? { width: 300, height: 300 }
      : { width: 900, height: 150 };
  const openPicker = (): void => {
    ImagePicker.openPicker({
      ...aspect,
      cropping: true,
      compressImageQuality: 0.8,
    }).then((image) => {
      setImageData(image);
    });
  };

  const takePhoto = (): void => {
    ImagePicker.openCamera({
      ...aspect,
      cropping: true,
      compressImageQuality: 0.8,
    }).then((image) => {
      setImageData(image);
    });
  };

  const updatePhoto = async (): Promise<void> => {
    const fileUri = imageData.path;
    const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
    try {
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: filename,
          type,
          id: user._id,
        },
      });

      if (!data || !data.uploadLink) {
        showMessage('error', 'Image upload failed');
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      const rawData = await RNFS.readFile(fileUri, 'base64');
      const buffer = new Buffer(
        rawData.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
      await fetch(uploadUrl, {
        method: 'PUT',
        body: buffer,
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
        showMessage('success', 'Profile photo successfully updated.');
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
        showMessage('success', 'Cover photo successfully updated.');
      }

      navigation.goBack();
    } catch (err) {
      console.log('upload error,', err);
      showMessage('error', (err as Error).message);
    } finally {
      setImageData(null);
    }
  };

  return (
    <View style={pStyles.globalContainer}>
      <MainHeader
        leftIcon={<CaretLeft color={WHITE} />}
        centerIcon={
          <Text style={styles.header}>
            {type === 'AVATAR' ? 'Edit Profile Photo' : 'Edit Cover Photo'}
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
          {type === 'AVATAR' ? (
            imageData?.path ? (
              <FastImage
                style={styles.avatar}
                source={{
                  uri: imageData.path,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <Avatar user={user} size={200} />
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
                uri: `${S3_BUCKET}/backgrounds/${user._id}/${user.background.url}`,
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
