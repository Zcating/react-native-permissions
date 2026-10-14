import { RNAbility } from '@rnoh/react-native-openharmony';
import { Want } from '@kit.AbilityKit';

export default class EntryAbility extends RNAbility {
  onCreate(want: Want) {
    super.onCreate(want);
    // Permission requests are driven entirely by the JS layer through the
    // react-native-permissions TurboModule (PERMISSIONS.HARMONY.*). We do not
    // call abilityAccessCtrl.requestPermissionsFromUser here on purpose: on a
    // fresh install OHOS can return authResults=-1 ("denied") without surfacing
    // the system dialog, which would leave the JS layer unable to distinguish
    // "denied" from "never asked". Letting JS own the
    // check() -> request() -> openSettings() flow mirrors iOS/Android.
  }

  getPagePath() {
    return 'pages/Index';
  }
}