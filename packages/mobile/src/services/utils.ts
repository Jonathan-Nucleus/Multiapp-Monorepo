import Toast from 'react-native-toast-message';

/**
 * @param title         The title of alert
 * @param description   The description of alert
 * @param type          The type of alert, one of success, error and info
 */
export function showMessage(
  type: string,
  title: string,
  description?: string,
): void {
  Toast.show({
    type,
    text1: title,
    text2: description,
  });
}
