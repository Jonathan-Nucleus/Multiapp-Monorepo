import { CommonActions } from '@react-navigation/native';

const config = {};

export function setNavigator(nav) {
  if (nav) {
    config.navigator = nav;
  }
}

export function navigate(routeName, params) {
  if (config.navigator && routeName) {
    let action = CommonActions.navigate({
      name: routeName,
      params,
    });
    config.navigator.dispatch(action);
  }
}

export function goBack() {
  if (config.navigator) {
    let action = CommonActions.goBack({});
    config.navigator.dispatch(action);
  }
}
