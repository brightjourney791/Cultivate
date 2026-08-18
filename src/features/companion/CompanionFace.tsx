import { Image, View } from 'react-native';
import { CompanionConfig, ExpressionKey, getCompanionLayout } from './companionAssets';

export default function CompanionFace({
  config,
  width,
  expression = 'open',
}: {
  config: CompanionConfig;
  width: number;
  expression?: ExpressionKey;
}) {
  const layout = getCompanionLayout(config, width);
  const eyesSource = config.eyes?.[expression];

  return (
    <View style={{ width: layout.width, height: layout.height, overflow: 'hidden' }}>
      <Image source={config.bodyImage} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      {eyesSource && (
        <Image
          source={eyesSource}
          style={{
            position: 'absolute',
            width: layout.eyesWidth,
            height: layout.eyesHeight,
            left: layout.eyesLeft,
            top: layout.eyesTop,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}