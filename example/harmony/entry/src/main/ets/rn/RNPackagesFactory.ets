import { PermissionsPackage } from 'react-native-permissions';
import type { RNPackage, RNPackageContext } from '@rnoh/react-native-openharmony/ts';

// react-native-permissions ships no RNOH autolinking manifest, so its package
// is registered explicitly here rather than discovered by the autolinker.
export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new PermissionsPackage(ctx),
  ];
}