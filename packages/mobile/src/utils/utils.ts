import { Dimensions } from 'react-native';

export const appWidth = Dimensions.get('window').width;
export const appHeight = Dimensions.get('window').height;

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string) => {
  const stringRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])');
  const numberRegex = new RegExp('^(?=.*[0-9])');
  const specialRegex = new RegExp('^(?=.*[!@#$%^&*])');
  const lengthRegex = new RegExp('^(?=.{8,16})');
  return {
    checkedString: stringRegex.test(password),
    checkedNumber: numberRegex.test(password),
    checkedSpecial: specialRegex.test(password),
    checkedLength: lengthRegex.test(password),
  };
};
