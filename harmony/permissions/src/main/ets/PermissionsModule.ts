/*
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {abilityAccessCtrl, bundleManager, Permissions} from '@kit.AbilityKit';
import {BusinessError} from '@kit.BasicServicesKit';
import {photoAccessHelper} from '@kit.MediaLibraryKit';
import Base from '@ohos.base';
import notificationManager from '@ohos.notificationManager';
import {TurboModule, UITurboModuleContext} from '@rnoh/react-native-openharmony/ts';
import log from './Logger';
import {GrantStatus, NotificationsResponse} from './results';

export class PermissionsModule extends TurboModule {
  constructor(ctx: UITurboModuleContext) {
    super(ctx);
  }
  /**
   * Checks the grant status of a single permission
   * */
  async check(permission: Permissions): Promise<string> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();

    // Get the application's accessTokenID
    let tokenId: number = await this.getTokenId();

    // Check the permission
    try {
      return this.getCheckGrantStatus(await atManager.checkAccessToken(tokenId, permission));
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      log.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
      return `Failed to check access token. Code is ${err.code}, message is ${err.message}`;
    }
  }

  /**
   * Checks the grant status of multiple permissions
   * */
  async checkMultiple(permissions: Array<Permissions>): Promise<Object> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let grantStatus: Record<string, GrantStatus> = {};

    // Get the application's accessTokenID
    let tokenId: number = await this.getTokenId();
    for (let index = 0; index < permissions.length; index++) {
      // Verify whether the app has been granted the permission
      try {
        const Status = await atManager.checkAccessToken(tokenId, permissions[index]);
        grantStatus[permissions[index]] = this.getCheckGrantStatus(Status);
      } catch (error) {
        let err: BusinessError = error as BusinessError;
        log.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
        return `Failed to check access token. Code is ${err.code}, message is ${err.message}`;
      }
    }
    return grantStatus;
  }

  /**
   * Request a permission
   */
  async request(permissions: Permissions): Promise<string> {
    let grantStatus: string = await this.check(permissions);
    if (grantStatus === GrantStatus.PERMISSION_GRANTED) {
      // Already granted, the target operation can proceed
      return grantStatus;
    } else {
      // Not granted, request the permission
      let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
      try {
        let context = this.ctx.uiAbilityContext;
        const resultData = await atManager.requestPermissionsFromUser(context, [permissions]);
        return this.getRequestGrantStatus(
          resultData.authResults[0],
          resultData.dialogShownResults[0],
        );
      } catch (err) {
        let target: BusinessError = err as BusinessError;
        log.error(`request, request permission failed, error code: ${target.code}`);
        return `request catch err->${JSON.stringify(err)}`;
      }
    }
  }

  /**
   * Request multiple permissions
   */
  async requestMultiple(permissions: Array<Permissions>): Promise<Object> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let resultsStatus: Record<string, GrantStatus> = {};
    try {
      let context = this.ctx.uiAbilityContext;
      const resultData = await atManager.requestPermissionsFromUser(context, permissions);
      for (let index = 0; index < resultData.authResults.length; index++) {
        const status = this.getRequestGrantStatus(
          resultData.authResults[index],
          resultData.dialogShownResults[index],
        );
        resultsStatus[permissions[index]] = status;
      }
      return resultsStatus;
    } catch (err) {
      let target: BusinessError = err as BusinessError;
      log.error(`requestMultiple, request permissions failed, error code: ${target.code}`);
      return `requestMultiple catch err->${JSON.stringify(err)}`;
    }
  }

  /**
   * Enables notifications for the app
   * */
  requestNotifications(): Promise<NotificationsResponse> {
    return new Promise((resolve, reject) => {
      notificationManager
        .requestEnableNotification()
        .then(() => {
          resolve({
            status: GrantStatus.PERMISSION_GRANTED,
            settings: {},
          });
        })
        .catch((err: Base.BusinessError) => {
          reject(err);
        });
    });
  }

  /**
   * Queries whether notifications are enabled for the app
   * */
  checkNotifications() {
    return new Promise((resolve, reject) => {
      notificationManager
        .isNotificationEnabled()
        .then((data: boolean) => {
          resolve({
            status: data ? GrantStatus.PERMISSION_GRANTED : GrantStatus.PERMISSION_BLOCKED,
            settings: {},
          });
        })
        .catch((err: Base.BusinessError) => {
          reject(err);
        });
    });
  }

  /**
   * Opens the settings app so the user can toggle permissions
   * */
  async openSettings(): Promise<void> {
    let context = this.ctx.uiAbilityContext;
    let want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility',
    };
    try {
      await context.startAbility(want);
    } catch (e) {
      log.error(`openSettings, start ability failed, error code ${(e as BusinessError).code}`);
    }
  }

  /**
   * Opens the photo picker
   * */
  async openPhotoPicker() {
    try {
      let PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      PhotoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      PhotoSelectOptions.maxSelectNumber = 5;
      let photoPicker = new photoAccessHelper.PhotoViewPicker();
      photoPicker
        .select(PhotoSelectOptions)
        .then((PhotoSelectResult: photoAccessHelper.PhotoSelectResult) => {})
        .catch((err: BusinessError) => {
          log.error(`openPhotoPicker, PhotoViewPicker.select failed with err: ${err.code}`);
        });
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      log.error(`openPhotoPicker, PhotoViewPicker failed with err: ${err.code}`);
    }
  }

  private getCheckGrantStatus(status: number): GrantStatus {
    let resultStatus: GrantStatus = GrantStatus.PERMISSION_UNAVAILABLE;
    if (status === -1) {
      resultStatus = GrantStatus.PERMISSION_DENIED;
    } else if (status === 0) {
      resultStatus = GrantStatus.PERMISSION_GRANTED;
    } else {
      log.warn(`getCheckGrantStatus, grantStatus unknown, status: ${status}}`);
    }
    return resultStatus;
  }

  private getRequestGrantStatus(status: number, dialogShownResult: boolean = true): GrantStatus {
    let resultStatus: GrantStatus = GrantStatus.PERMISSION_UNAVAILABLE;
    if (status === -1) {
      resultStatus = dialogShownResult
        ? GrantStatus.PERMISSION_DENIED
        : GrantStatus.PERMISSION_BLOCKED;
    } else if (status === 0) {
      resultStatus = GrantStatus.PERMISSION_GRANTED;
    } else if (status === 2) {
      resultStatus = GrantStatus.PERMISSION_UNAVAILABLE;
    } else {
      log.warn(`getRequestGrantStatus, grantStatus unknown, status: ${status}}`);
    }
    return resultStatus;
  }

  private async getTokenId(): Promise<number> {
    try {
      let bundleInfo: bundleManager.BundleInfo = await bundleManager.getBundleInfoForSelf(
        bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION,
      );
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      return appInfo.accessTokenId;
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      log.error(`getTokenId, get tokenId failed, error code: ${err.message}`);
      return -1;
    }
  }
}
