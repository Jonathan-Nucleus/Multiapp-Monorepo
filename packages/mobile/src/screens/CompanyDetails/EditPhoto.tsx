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
import {
  CaretLeft,
  Camera,
  Image as ImagePhoto,
  Trash,
} from 'phosphor-react-native';
import { AVATAR_URL, BACKGROUND_URL } from 'react-native-dotenv';
import ImagePicker from 'react-native-image-crop-picker';
const Buffer = global.Buffer || require('buffer').Buffer;

import MainHeader from 'mobile/src/components/main/Header';
import PAppContainer from 'mobile/src/components/common/PAppContainer';
import PGradientButton from 'mobile/src/components/common/PGradientButton';
import { showMessage } from 'mobile/src/services/utils';
import pStyles from 'mobile/src/theme/pStyles';
import { Body1Bold, Body2, Body2Bold, H5Bold } from 'mobile/src/theme/fonts';
import {
  WHITE,
  PRIMARYSOLID,
  WHITE12,
  WHITE60,
  PRIMARY,
} from 'shared/src/colors';

import {
  useCompany,
  CompanyProfile,
} from 'shared/graphql/query/company/useCompany';
import { useUpdateCompanyProfile } from 'shared/graphql/mutation/account';
import { useFetchUploadLink } from 'shared/graphql/mutation/posts';

import { EditCompanyPhotoScreen } from 'mobile/src/navigations/CompanyDetailsStack';

const EditCompanyPhoto: EditCompanyPhotoScreen = ({ navigation, route }) => {
  const { companyId, type } = route.params;

  const { data: companyData } = useCompany(companyId);
  const [imageData, setImageData] = useState<any>({});
  const [updateCompanyProfile] = useUpdateCompanyProfile();
  const [fetchUploadLink] = useFetchUploadLink();

  const company = companyData?.companyProfile;
  if (!company) return null;

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
    try {
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: imageData?.filename,
          type,
          id: company._id,
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
          _id: company._id,
          avatar: remoteName,
          name: company.name,
        };
        await updateCompanyProfile({
          variables: {
            profile,
          },
        });
      }

      if (type === 'BACKGROUND') {
        const profile = {
          _id: company._id,
          name: company.name,
          background: {
            url: remoteName,
            width: 500,
            height: 200,
            x: 0,
            y: 0,
            scale: 2,
          },
        };
        await updateCompanyProfile({
          variables: {
            profile,
          },
        });
      }
      showMessage('success', 'Cover photo is updated.');
      navigation.goBack();
    } catch (err) {
      console.log('upload error=====>', err);
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
            {type === 'AVATAR' ? 'Edit Logo' : 'Edit Cover Photo'}
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
            ) : company?.avatar ? (
              <FastImage
                style={styles.avatar}
                source={{
                  uri: `${AVATAR_URL}/${company?.avatar}`,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.noAvatarContainer}>
                <Text style={styles.noAvatar}>{company.name.charAt(0)}</Text>
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
          ) : company?.background?.url ? (
            <FastImage
              style={styles.cover}
              source={{
                uri: `${BACKGROUND_URL}/${company?.background.url}`,
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

export default EditCompanyPhoto;

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
    borderRadius: 8,
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
