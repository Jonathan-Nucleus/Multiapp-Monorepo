import React, { useState } from 'react';
import {
  Image,
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
} from 'react-native-controlled-mentions';
import _ from 'lodash';

import PAppContainer from '../../components/common/PAppContainer';
import PLabel from '../../components/common/PLabel';
import IconButton from '../../components/common/IconButton';
import RoundImageView from '../../components/common/RoundImageView';
import UserInfo from '../../components/common/UserInfo';
import PModal from '../../components/common/PModal';
import PostSelection from './PostSelection';
import pStyles from '../../theme/pStyles';
import {
  GRAY3,
  SECONDARY,
  WHITE60,
  DISABLED,
  PRIMARY,
  PRIMARYSOLID7,
  PRIMARYSOLID,
  WHITE,
  WHITE12,
  BGDARK,
} from 'shared/src/colors';
import { CreatePostScreen } from 'mobile/src/navigations/HomeStack';
import PostHeader from './PostHeader';

import UserSvg from 'shared/assets/images/user.svg';
import GlobalSvg from 'shared/assets/images/global.svg';
import AISvg from 'shared/assets/images/ai-badge.svg';
import Avatar from '../../assets/avatar.png';
import {
  Camera,
  VideoCamera,
  Image as GalleryImage,
  CirclesFour,
} from 'phosphor-react-native';
import { Audience } from 'mobile/src/graphql/query/post/usePosts';

const RadioBodyView = (props: any) => {
  const { icon, label } = props;
  return (
    <View style={styles.radioBodyWrapper}>
      {icon}
      <PLabel label={label} viewStyle={styles.radioBodyTextStyle} />
    </View>
  );
};

export interface OptionProps<T = string> {
  id: number;
  val: T;
  labelView: React.ReactNode;
}

export const postAsData: OptionProps[] = [
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

export const audienceData: OptionProps<Audience>[] = [
  {
    id: 1,
    val: 'EVERYONE',
    labelView: <RadioBodyView icon={<AISvg />} label="Everyone" />,
  },
  {
    id: 2,
    val: 'ACCREDITED',
    labelView: <RadioBodyView icon={<AISvg />} label="Accredited Investors" />,
  },
  {
    id: 3,
    val: 'QUALIFIED_PURCHASER',
    labelView: <RadioBodyView icon={<AISvg />} label="Qualified Purchasers" />,
  },
  {
    id: 4,
    val: 'QUALIFIED_CLIENT',
    labelView: <RadioBodyView icon={<AISvg />} label="Qualified Clients" />,
  },
];

export const users = [
  { id: '624f1a2eed55addaea6b4499', name: 'David Tabaka' },
  { id: '624f1a2eed55addaea6b4491', name: 'Michelle Miranda' },
  { id: '624f1a2eed55addaea6b4492', name: 'Brain Bueman' },
  { id: '624f1a2eed55addaea6b4493', name: 'Gary Guy' },
  { id: '624f1a2eed55addaea6b4494', name: 'Alex Beinfeld' },
];

const CreatePost: CreatePostScreen = ({ navigation }) => {
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
  const [mentions, setMentions] = useState<string[]>([]);

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

  const checkValidation = () => {
    if (!description || _.isEmpty(imageData)) {
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!checkValidation()) {
      return;
    }

    navigation.navigate('ChooseCategory', { description, mentions, imageData });
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
      <PostHeader
        centerLabel="Create Post"
        rightLabel="NEXT"
        rightValidation={checkValidation()}
        handleNext={handleNext}
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
      </PAppContainer>
      <View style={styles.actionWrapper}>
        <IconButton
          icon={<Camera size={32} color={WHITE} />}
          label="Take Photo"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
          onPress={takePhoto}
        />
        <IconButton
          icon={<VideoCamera size={32} color={WHITE} />}
          label="Take Video"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
        />
        <IconButton
          icon={<GalleryImage size={32} color={WHITE} />}
          label="Gallery"
          textStyle={styles.iconText}
          viewStyle={styles.iconButton}
          onPress={openPicker}
        />
        <IconButton
          icon={<CirclesFour size={32} color={WHITE} />}
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
    backgroundColor: BGDARK,
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
    borderTopColor: WHITE12,
    borderTopWidth: 1,
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
});
