import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactElement,
} from 'react';
import {
  StyleSheet,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Lottie, { AnimationObject } from 'lottie-react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WelcomeScreen } from 'mobile/src/navigations/AuthStack';

import PHeader from '../../components/common/PHeader';
import LogoSvg from '../../assets/icons/logo.svg';

import PBackgroundImage from '../../components/common/PBackgroundImage';
import PGradientButton from '../../components/common/PGradientButton';
import { Body2 } from '../../theme/fonts';
import { GRAY200, GRAY800, PRIMARY, WHITE } from 'shared/src/colors';
import WelcomeSvg from '../../assets/images/welcome.svg';

const DEVICE_WIDTH = Dimensions.get('window').width;

type WelcomeData = {
  animation: string | AnimationObject;
  text1: string;
  text2: string;
};

const welcomeData: WelcomeData[] = [
  {
    animation: require('../../assets/animations/onboarding-texts.json'),
    text1: 'Get professional\ninvestment insights.',
    text2: '',
  },
  {
    animation: require('../../assets/animations/onboarding-funds.json'),
    text1: 'Access high quality\nalternative funds.',
    text2: '(Accredited investors only)',
  },
];

type AnimationCompProp = (props: { item: WelcomeData }) => ReactElement | null;

const AnimationComp: AnimationCompProp = ({ item }) => {
  const [lottieProgress] = useState(new Animated.Value(0));
  const [textProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(lottieProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    Animated.timing(textProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [lottieProgress, textProgress]);

  const lottieStyle = useMemo(() => {
    return [
      styles.container,
      {
        opacity: lottieProgress,
      },
    ];
  }, [lottieProgress]);

  const textContainerStyle = useMemo(() => {
    return [
      {
        opacity: textProgress,
      },
    ];
  }, [textProgress]);

  return (
    <View style={styles.container}>
      <Animated.View style={lottieStyle}>
        <Lottie source={item.animation} autoPlay loop style={styles.lottie} />
      </Animated.View>
      <Animated.View style={textContainerStyle}>
        <Text style={styles.itemText1}>{item.text1}</Text>
        <Text style={styles.itemText2}>{item.text2}</Text>
      </Animated.View>
    </View>
  );
};

const Welcome: WelcomeScreen = ({ navigation }) => {
  const [welcomeAnimProgress] = useState(new Animated.Value(0));
  const [btnAnimProgress] = useState(new Animated.Value(0));
  const [animFinished, setAnimFinished] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const animation = useCallback(() => {
    // Make welcome animation as 2 seconds fade in/out
    Animated.timing(welcomeAnimProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        Animated.timing(welcomeAnimProgress, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }).start(() => {
          setAnimFinished(true);
        });
      }
    });
    // Bottom Button Container animation
    Animated.timing(btnAnimProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [btnAnimProgress, welcomeAnimProgress]);

  useEffect(() => {
    setTimeout(() => {
      animation();
    }, 1000);
  }, [animation]);

  const welcomeStyle = useMemo(() => {
    return {
      marginTop: 64,
      opacity: welcomeAnimProgress,
    };
  }, [welcomeAnimProgress]);

  const btnContainerStyle = useMemo(() => {
    return [
      styles.btnContainer,
      {
        opacity: btnAnimProgress,
      },
    ];
  }, [btnAnimProgress]);

  const headerStyle = useMemo(() => {
    return { opacity: animFinished ? 1 : 0 };
  }, [animFinished]);

  const handleSignUpPage = useCallback(() => {
    navigation.navigate('Code');
    AsyncStorage.setItem('onboarded_status', 'onboarded');
  }, [navigation]);

  const handleLoginPage = useCallback(() => {
    navigation.navigate('Login');
    AsyncStorage.setItem('onboarded_status', 'onboarded');
  }, [navigation]);

  const renderItem: ListRenderItem<WelcomeData> = ({ item, index }) => {
    return <AnimationComp key={index} item={item} />;
  };

  return (
    <PBackgroundImage>
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
        <PHeader centerIcon={<LogoSvg />} containerStyle={headerStyle} />
        <View style={styles.container}>
          <View style={styles.body}>
            {animFinished ? (
              <View style={styles.container}>
                <Carousel
                  data={welcomeData}
                  renderItem={renderItem}
                  sliderWidth={DEVICE_WIDTH}
                  itemWidth={DEVICE_WIDTH}
                  onSnapToItem={(index) => setSlideIndex(index)}
                />
                <Pagination
                  containerStyle={styles.paginationContainer}
                  activeDotIndex={slideIndex}
                  dotsLength={2}
                  dotStyle={styles.dot}
                  inactiveDotScale={1}
                  dotColor={GRAY200}
                  inactiveDotColor={GRAY800}
                />
              </View>
            ) : (
              <Animated.View style={welcomeStyle}>
                <WelcomeSvg />
              </Animated.View>
            )}
          </View>
          <Animated.View style={btnContainerStyle}>
            <PGradientButton
              label="Get started"
              btnContainer={styles.button}
              onPress={handleSignUpPage}
            />
            <TouchableOpacity style={styles.btnText} onPress={handleLoginPage}>
              <Text style={styles.hyperText}>I already have an account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </PBackgroundImage>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  paginationContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  btnContainer: {
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 45,
    marginBottom: 28,
  },
  btnText: {
    marginBottom: 46,
  },
  hyperText: {
    ...Body2,
    color: PRIMARY,
    lineHeight: 16,
    textAlign: 'center',
  },
  itemText1: {
    ...Body2,
    color: WHITE,
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  itemText2: {
    ...Body2,
    color: WHITE,
    lineHeight: 15,
    fontSize: 10,
    textAlign: 'center',
  },
  lottie: {
    marginBottom: -80,
  },
});
