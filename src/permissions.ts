import type {AndroidPermissionMap} from './permissions.android';
import type {HarmonyPermissionMap} from './permissions.harmony';
import type {IOSPermissionMap} from './permissions.ios';
import type {WindowsPermissionMap} from './permissions.windows';
import {proxifyPermissions} from './utils';

export const PERMISSIONS = Object.freeze({
  ANDROID: proxifyPermissions<AndroidPermissionMap>('android'),
  HARMONY: proxifyPermissions<HarmonyPermissionMap>('harmony'),
  IOS: proxifyPermissions<IOSPermissionMap>('ios'),
  WINDOWS: proxifyPermissions<WindowsPermissionMap>('windows'),
} as const);
