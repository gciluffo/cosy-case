# iOS development build on simulator

1. `npm run ios-dev-build-simulator`
2. `eas build:run --path=./build-1741769520285.tar.gz`
3. `npx expo start --dev-client`

# iOS development build on device

1. `npm run ios-dev-build`
2. Open Xcode and go to devices. Command + Shift + 2.
3. Drag .ipa to physical device

# Update ios and android folders

1. `npx expo prebuild`
