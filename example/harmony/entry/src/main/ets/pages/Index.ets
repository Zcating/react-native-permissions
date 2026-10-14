import {
  ComponentBuilderContext,
  MetroJSBundleProvider,
  RNApp,
  RNOHCoreContext,
  RNOHErrorDialog,
  RNOHLogger,
  TraceJSBundleProviderDecorator,
} from '@rnoh/react-native-openharmony';
import { createRNPackages } from '../rn/RNPackagesFactory';

@Builder
export function buildCustomRNComponent(ctx: ComponentBuilderContext) {
}

const wrappedCustomRNComponentBuilder = wrapBuilder(buildCustomRNComponent);

@Entry
@Component
struct Index {
  @StorageLink('RNOHCoreContext') private rnohCoreContext: RNOHCoreContext | undefined = undefined;
  @State shouldShow: boolean = false;
  private logger!: RNOHLogger;

  aboutToAppear() {
    this.logger = this.rnohCoreContext!.logger.clone('Index');
    const stopTracing = this.logger.clone('aboutToAppear').startTracing();
    this.shouldShow = true;
    stopTracing();
  }

  onBackPress(): boolean | undefined {
    this.rnohCoreContext!.dispatchBackPress();
    return true;
  }

  build() {
    Column() {
      if (this.rnohCoreContext && this.shouldShow) {
        if (this.rnohCoreContext?.isDebugModeEnabled) {
          RNOHErrorDialog({ ctx: this.rnohCoreContext });
        }
        RNApp({
          rnInstanceConfig: {
            createRNPackages,
            enableNDKTextMeasuring: true,
            enableBackgroundExecutor: false,
            enableCAPIArchitecture: true,
            arkTsComponentNames: [],
          },
          initialProps: {} as Record<string, string>,
          appKey: 'RNPermissionsExample',
          wrappedCustomRNComponentBuilder: wrappedCustomRNComponentBuilder,
          onSetUp: (rnInstance) => {
            rnInstance.enableFeatureFlag('ENABLE_RN_INSTANCE_CLEAN_UP');
          },
          // Dev-server only: run `yarn start` in example/ so Metro serves the
          // JS bundle with platform=harmony, which is what makes the resolver
          // pick methods.harmony.ts / permissions.harmony.ts over the .ts files.
          jsBundleProvider: new TraceJSBundleProviderDecorator(
            new MetroJSBundleProvider(),
            this.rnohCoreContext.logger),
        });
      }
    }
    .height('100%')
    .width('100%')
  }
}