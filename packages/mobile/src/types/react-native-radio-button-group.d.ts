declare module 'react-native-radio-button-group' {
  export interface Option<TValue = string> {
    id: TValue | number;
    value?: string;
    label?: string;
    labelView?: React.ReactNode;
  }

  export interface RadioGroupProps<TValue = string> {
    options: Option<TValue>[];
    horizontal?: boolean;
    circleStyle?: React.StyleProp<React.ViewStyle>;
    activeButtonId: Option['id'];
    onChange: (option: Option<TValue>) => void | Promise<void>;
  }

  declare const RadioGroup: React.FC<RadioGroupProps>;

  export = RadioGroup;
}
