import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import RadioGroup from 'react-native-radio-button-group';
import {
  MentionInput,
  MentionSuggestionsProps,
  Suggestion,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import { useMutation } from '@apollo/client';
import _ from 'lodash';

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
  PRIMARY,
  PRIMARYSOLID7,
  PRIMARYSOLID,
} from 'shared/src/colors';
import { CREATE_POST, PostDataType, UPLOAD_LINK } from '../../graphql/post';
import { CreatePostScreen } from 'mobile/src/navigations/HomeStack';
import { showMessage } from '../../services/utils';
import { SOMETHING_WRONG } from 'shared/src/constants';

import BackSvg from '../../assets/icons/back.svg';
import ChatSvg from 'shared/assets/images/chat.svg';
import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import AISvg from 'shared/assets/images/ai-badge.svg';
import Avatar from '../../assets/avatar.png';
import Tag from '../../components/common/Tag';

const Steps: string[] = ['CreatePost', 'ReviewPost'];

const RadioBodyView = (props: any) => {
  const { icon, label } = props;
  return (
    <View style={styles.radioBodyWrapper}>
      {icon}
      <PLabel label={label} viewStyle={styles.radioBodyTextStyle} />
    </View>
  );
};

interface OptionProps {
  id: number;
  val: string;
  labelView: React.ReactNode;
}

const postAsData: OptionProps[] = [
  {
    id: 1,
    val: 'Richard Branson',
    labelView: (
      <RadioBodyView
        icon={<Image source={Avatar} style={{ width: 32, height: 32 }} />}
        label="Richard Branson"
      />
    ),
  },
  {
    id: 2,
    val: 'Good Soil Investments',
    labelView: (
      <RadioBodyView
        icon={<Image source={Avatar} style={{ width: 32, height: 32 }} />}
        label="Good Soil Investments"
      />
    ),
  },
];

const audienceData: OptionProps[] = [
  {
    id: 1,
    val: 'Everyone',
    labelView: <RadioBodyView icon={<AISvg />} label="Everyone" />,
  },
  {
    id: 2,
    val: 'Accredited Investors',
    labelView: <RadioBodyView icon={<AISvg />} label="Accredited Investors" />,
  },
  {
    id: 3,
    val: 'Qualified Purchasers',
    labelView: <RadioBodyView icon={<AISvg />} label="Qualified Purchasers" />,
  },
  {
    id: 4,
    val: 'Qualified Clients',
    labelView: <RadioBodyView icon={<AISvg />} label="Qualified Clients" />,
  },
];

const users = [
  { id: '123355654789', name: 'David Tabaka' },
  { id: '123355654783', name: 'Michelle Miranda' },
  { id: '123355654739', name: 'Brain Bueman' },
  { id: '412335565478', name: 'Gary Guy' },
  { id: '123355654785', name: 'Alex Beinfeld' },
];

const CreatePost: CreatePostScreen = ({ route, navigation }) => {
  const [postAsModalVisible, setPostAsModalVisible] = useState(false);
  const [selectedPostAs, setSelectedPostAs] = useState<OptionProps>(
    postAsData[0],
  );
  const [audienceModalVisible, setAudienceModalVisible] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<OptionProps>(
    audienceData[0],
  );
  const [imageData, setImageData] = useState<any>({});
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [step, setStep] = useState(Steps[0]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [createPost] = useMutation(CREATE_POST);
  const [uploadLink] = useMutation(UPLOAD_LINK);

  useEffect(() => {
    const categoryList = route.params?.categories;
    if (categoryList && categoryList.length > 0) {
      setCategories(categoryList);
      setStep(Steps[1]);
    } else {
      setStep(Steps[0]);
    }
  }, [route, route.params]);

  const openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setImageData(image);
    });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setImageData(image);
    });
  };

  const checkValidation = () => {
    if (!description || _.isEmpty(imageData)) {
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (step === Steps[0]) {
      navigation.navigate('ChooseCategory');
      return;
    }

    // step === 1 (ReviewPost)
    if (!checkValidation()) {
      return;
    }

    try {
      const { data } = await uploadLink({
        variables: {
          localFilename: imageData?.filename,
          type: 'POST',
        },
      });

      if (!data || !data.uploadLink) {
        showMessage('Error', 'Image upload failed', 'error');
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      const formdata = new FormData();
      if (imageData != null) {
        formdata.append('data_img', {
          uri:
            Platform.OS === 'ios'
              ? `file:///${imageData.path}`
              : imageData.path,
          type: imageData.mime,
          name: imageData.filename,
        });
      }

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: formdata,
      });

      const postData: PostDataType = {
        categories,
        audience: selectedAudience.val.toUpperCase(),
        body: replaceMentionValues(description, ({ name }) => `@${name}`),
        mediaUrl: remoteName,
        mentionIds: mentions,
      };

      const result = (
        await createPost({
          variables: {
            post: postData,
          },
        })
      ).data.createPost;
      console.log('success', result);
      showMessage('Success', 'Successfully posted!', 'success');
    } catch (e) {
      console.log('error', e);
      showMessage('Error', SOMETHING_WRONG, 'error');
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
          <PLabel
            label={step === Steps[0] ? 'Create Post' : 'Preview Post'}
            textStyle={styles.headerTitle}
          />
        }
        rightIcon={
          <TouchableOpacity onPress={handleNext}>
            <PLabel
              label={step === Steps[0] ? 'NEXT' : 'POST'}
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
            label={selectedPostAs?.val}
            viewStyle={{ marginHorizontal: 8 }}
            onPress={() => setPostAsModalVisible(true)}
          />
          <PostSelection
            icon={<GlobalSvg />}
            label={selectedAudience?.val}
            onPress={() => setAudienceModalVisible(true)}
          />
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
        {!_.isEmpty(imageData) && (
          <Image source={{ uri: imageData.path }} style={styles.postImage} />
        )}
        {categories && categories.length > 0 && (
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <Tag label={item} viewStyle={styles.tagStyle} />
            )}
            listKey="category"
          />
        )}
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
        isVisible={postAsModalVisible}
        title="Post As"
        subTitle="You can post as yourself or a company you manage.">
        <View style={styles.radioGroupStyle}>
          <RadioGroup
            options={postAsData}
            activeButtonId={selectedPostAs?.id}
            circleStyle={styles.radioCircle}
            onChange={(options: OptionProps) => {
              setSelectedPostAs(options);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => setPostAsModalVisible(false)}
          style={styles.doneBtn}>
          <PLabel label="DONE" />
        </TouchableOpacity>
      </PModal>
      <PModal
        isVisible={audienceModalVisible}
        title="Audience"
        subTitle="Who can see your post?">
        <View style={styles.radioGroupStyle}>
          <RadioGroup
            options={audienceData}
            activeButtonId={selectedAudience?.id}
            circleStyle={styles.radioCircle}
            onChange={(options: OptionProps) => {
              setSelectedAudience(options);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => setAudienceModalVisible(false)}
          style={styles.doneBtn}>
          <PLabel label="DONE" />
        </TouchableOpacity>
      </PModal>
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
    marginVertical: 16,
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
  postImage: {
    width: '100%',
    height: 224,
    marginVertical: 16,
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
  radioGroupStyle: {
    marginVertical: 30,
  },
  radioCircle: {
    width: 24,
    height: 24,
    fillColor: PRIMARY,
    borderColor: PRIMARY,
    borderWidth: 2,
  },
  radioBodyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioBodyTextStyle: {
    marginLeft: 10,
  },
  doneBtn: {
    width: '100%',
    height: 45,
    borderRadius: 22,
    borderColor: PRIMARYSOLID,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARYSOLID7,
  },
  tagStyle: {
    paddingHorizontal: 15,
    marginRight: 8,
    borderRadius: 16,
  },
});
