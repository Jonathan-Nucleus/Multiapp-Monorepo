declare module 'react-native-heic-converter' {
  interface ConvertOptions {
    path: string;
    quality?: number; // Quality for jpeg files
    extension: 'jpg' | 'png' | 'base64';
  }

  interface ConvertResult {
    success: boolean;
    path: string;
    error: Error;
    base64?: string;
  }

  const RNHeicConverter = {
    convert(options: ConvertOptions): Promise<ConvertResult>;,
  };

  export = RNHeicConverter;
}
