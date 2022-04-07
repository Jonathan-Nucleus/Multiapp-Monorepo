import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { RadioButtonProps } from 'react-native-radio-buttons-group';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PLabel from '../../components/common/PLabel';
import RoundIcon from '../../components/common/RoundIcon';
import IconButton from '../../components/common/IconButton';
import RoundImageView from '../../components/common/RoundImageView';
import UserInfo from '../../components/common/UserInfo';
import PModal from '../../components/common/PModal';
import pStyles from '../../theme/pStyles';
import { Body1 } from '../../theme/fonts';
import { GRAY3 } from 'shared/src/colors';

import BackSvg from '../../assets/icons/back.svg';
import ChatSvg from 'shared/assets/images/chat.svg';
import Avatar from '../../assets/avatar.png';

interface CreatePostProps {
  navigation: any;
}

const radioButtonsData: RadioButtonProps[] = [
  {
    id: '1',
    label: 'Richard Branson',
    value: 'option1',
  },
  {
    id: '2',
    label: 'Good Soil Investments',
    value: 'option2',
  },
];

const CreatePost: React.FC<CreatePostProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  return (
    <SafeAreaView style={pStyles.globalContainer}>
      <PHeader
        leftIcon={
          <RoundIcon icon={<BackSvg />} onPress={() => navigation.goBack()} />
        }
        centerIcon={
          <PLabel label="Create Post" textStyle={styles.headerTitle} />
        }
        rightIcon={
          <TouchableOpacity>
            <PLabel label="Next" textStyle={styles.headerTitle} />
          </TouchableOpacity>
        }
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
        <View style={styles.usersPart}>
          <RoundImageView image={Avatar} imageStyle={styles.avatarImage} />
        </View>
        <UserInfo
          avatar={Avatar}
          name="Michelle Jordan"
          isPro
          role="CEO"
          company="Funds"
        />
      </PAppContainer>
      <View style={styles.actionWrapper}>
        <IconButton
          icon={<ChatSvg />}
          label="Take Photo"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
          onPress={takePhoto}
        />
        <IconButton
          icon={<ChatSvg />}
          label="Take Video"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
        />
        <IconButton
          icon={<ChatSvg />}
          label="Gallery"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
          onPress={openPicker}
        />
        <IconButton
          icon={<ChatSvg />}
          label="Categories"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
        />
      </View>
      <PModal
        isVisible={modalVisible}
        title="Post As"
        subTitle="You can post as yourself or a company you manage."
        optionsData={radioButtonsData}
        onPressDone={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    paddingTop: 0,
    marginBottom: 0,
  },
  headerTitle: {
    ...Body1,
  },
  usersPart: {
    marginTop: 16,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  actionWrapper: {
    backgroundColor: GRAY3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
  },
  iconButton: {
    flexDirection: 'column',
  },
  iconText: {
    marginTop: 5,
    marginLeft: 0,
  },
});
