import type {Contract} from './contract';
import NativeModule from './specs/NativeRNPermissions';
import type {NotificationsResponse, PermissionStatus} from './types';
import {canScheduleExactAlarms, canUseFullScreenIntent} from './unsupportedMethods';
import {uniq} from './utils';

const check: Contract['check'] = async (permission) => {
  const status = (await NativeModule.check(permission)) as PermissionStatus;
  return status;
};

const checkMultiple: Contract['checkMultiple'] = (permissions) => {
  return NativeModule.checkMultiple(uniq(permissions)) as ReturnType<Contract['checkMultiple']>;
};

const request: Contract['request'] = async (permission) => {
  const status = (await NativeModule.request(permission)) as PermissionStatus;
  return status;
};

const requestMultiple: Contract['requestMultiple'] = (permissions) => {
  return NativeModule.requestMultiple(uniq(permissions)) as ReturnType<Contract['requestMultiple']>;
};

const checkNotifications: Contract['checkNotifications'] = async () => {
  const response = (await NativeModule.checkNotifications()) as NotificationsResponse;
  return response;
};

const requestNotifications: Contract['requestNotifications'] = async (
  options = ['alert', 'badge', 'sound'],
) => {
  const response = (await NativeModule.requestNotifications(options)) as NotificationsResponse;
  return response;
};

/**
 * Opens the system settings app so the user can toggle the app's permissions.
 *
 * The native module takes no argument and always lands on the generic settings
 * page, so `type` is accepted for contract parity but ignored downstream.
 */
const openSettings: Contract['openSettings'] = async (type = 'application') => {
  await NativeModule.openSettings(type);
};

const openPhotoPicker: Contract['openPhotoPicker'] = async () => {
  await NativeModule.openPhotoPicker();
};

const checkLocationAccuracy: Contract['checkLocationAccuracy'] = () => {
  return Promise.reject(new Error('checkLocationAccuracy is not supported on Harmony'));
};

const requestLocationAccuracy: Contract['requestLocationAccuracy'] = () => {
  return Promise.reject(new Error('requestLocationAccuracy is not supported on Harmony'));
};

/**
 * iOS 18+ only, not available on HarmonyOS.
 */
const openContactPicker: Contract['openContactPicker'] = () => {
  return Promise.reject(new Error('openContactPicker is not supported on Harmony'));
};

export const methods: Contract = {
  canScheduleExactAlarms,
  canUseFullScreenIntent,
  check,
  checkLocationAccuracy,
  checkMultiple,
  checkNotifications,
  openContactPicker,
  openPhotoPicker,
  openSettings,
  request,
  requestLocationAccuracy,
  requestMultiple,
  requestNotifications,
};
