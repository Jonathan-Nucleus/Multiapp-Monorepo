import React, { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { RadioButtonProps } from 'react-native-radio-buttons-group';
import {
  MentionInput,
  MentionSuggestionsProps,
  Suggestion,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import { useMutation } from '@apollo/client';

import PAppContainer from '../../components/common/PAppContainer';
import PHeader from '../../components/common/PHeader';
import PLabel from '../../components/common/PLabel';
import RoundIcon from '../../components/common/RoundIcon';
import IconButton from '../../components/common/IconButton';
import RoundImageView from '../../components/common/RoundImageView';
import UserInfo from '../../components/common/UserInfo';
import PModal from '../../components/common/PModal';
import PostSelection from './PostSelection';
import pStyles from '../../theme/pStyles';
import { Body1 } from '../../theme/fonts';
import {
  GRAY3,
  GRAY800,
  SECONDARY,
  WHITE60,
  DISABLED,
  PRIMARYSOLID7,
} from 'shared/src/colors';
import { CREATE_POST, PostDataType } from '../../graphql/post';

import BackSvg from '../../assets/icons/back.svg';
import ChatSvg from 'shared/assets/images/chat.svg';
import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
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

const users = [
  { id: '123355654789', name: 'David Tabaka' },
  { id: '123355654783', name: 'Michelle Miranda' },
  { id: '123355654739', name: 'Brain Bueman' },
  { id: '412335565478', name: 'Gary Guy' },
  { id: '123355654785', name: 'Alex Beinfeld' },
];

const CreatePost: React.FC<CreatePostProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [createPost] = useMutation(CREATE_POST);

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

  const checkValidation = () => {
    if (!description) {
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!checkValidation()) {
      return;
    }

    const postData: PostDataType = {
      categories: ['NEWS', 'POLITICS'],
      audience: 'EVERYONE',
      body: replaceMentionValues(description, ({ name }) => `@${name}`),
      mediaUrl: 'https://unsplash.it/400/400?image=1',
      mentionIds: mentions,
    };

    try {
      const result = (
        await createPost({
          variables: {
            post: postData,
          },
        })
      ).data.createPost;
      console.log('success', result);
    } catch (e) {
      console.log('error', e);
    }
  };

  const renderSuggestions: (
    suggestions: Suggestion[],
  ) => React.FC<MentionSuggestionsProps> =
    (suggestions) =>
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      return (
        <View style={styles.mentionList}>
          {suggestions
            .filter((one) =>
              one.name
                .toLocaleLowerCase()
                .includes(keyword.toLocaleLowerCase()),
            )
            .map((one) => (
              <Pressable
                key={one.id}
                onPress={() => {
                  onSuggestionPress(one);
                  setMentions([...mentions, one.id]);
                }}
                style={styles.mentionItem}>
                <UserInfo
                  avatar={Avatar}
                  name={one.name}
                  isPro
                  role="CEO"
                  company="Funds"
                />
              </Pressable>
            ))}
        </View>
      );
    };

  const renderMentionSuggestions = renderSuggestions(users);

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
          <TouchableOpacity onPress={handleNext}>
            <PLabel
              label="NEXT"
              textStyle={
                checkValidation() ? styles.headerTitle : styles.disabledText
              }
            />
          </TouchableOpacity>
        }
        containerStyle={styles.headerContainer}
      />
      <PAppContainer>
        <View style={styles.usersPart}>
          <RoundImageView image={Avatar} imageStyle={styles.avatarImage} />
          <PostSelection
            icon={<UserSvg />}
            label="Richard Branson"
            viewStyle={{ marginHorizontal: 8 }}
          />
          <PostSelection icon={<GlobalSvg />} label="Everyone" />
        </View>
        <MentionInput
          value={description}
          onChange={setDescription}
          placeholder="Create a post"
          placeholderTextColor={WHITE60}
          style={styles.mentionInput}
          partTypes={[
            {
              isBottomMentionSuggestionsRender: true,
              isInsertSpaceAfterMention: true,
              trigger: '@',
              renderSuggestions: renderMentionSuggestions,
              textStyle: {
                color: SECONDARY,
              },
            },
          ]}
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
  disabledText: {
    ...Body1,
    color: GRAY800,
  },
  usersPart: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  mentionInput: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  mentionList: {
    backgroundColor: PRIMARYSOLID7,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  mentionItem: {
    borderBottomWidth: 1,
    borderBottomColor: DISABLED,
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
