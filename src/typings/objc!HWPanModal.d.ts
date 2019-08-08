
interface HWPanModalPresentable extends NSObjectProtocol {

	allowScreenEdgeInteractive?(): boolean;

	allowsDragToDismiss?(): boolean;

	allowsExtendedPanScrolling?(): boolean;

	allowsTapBackgroundToDismiss?(): boolean;

	anchorModalToLongForm?(): boolean;

	backgroundAlpha?(): number;

	backgroundBlurColor?(): UIColor;

	backgroundBlurRadius?(): number;

	cornerRadius?(): number;

	customDragIndicator?(): HWPanIndicatorView;

	customPresentingVCAnimation?(): HWPresentingViewControllerAnimatedTransitioning;

	isAutoHandleKeyboardEnabled?(): boolean;

	isHapticFeedbackEnabled?(): boolean;

	isPanScrollEnabled?(): boolean;

	isUserInteractionEnabled?(): boolean;

	keyboardOffsetFromInputView?(): number;

	longFormHeight?(): PanModalHeight;

	panModalDidDismissed?(): void;

	panModalGestureRecognizerDismissPercent?(panGestureRecognizer: UIPanGestureRecognizer, percent: number): void;

	panModalWillDismiss?(): void;

	panScrollable?(): UIScrollView;

	scrollIndicatorInsets?(): UIEdgeInsets;

	shortFormHeight?(): PanModalHeight;

	shouldAnimatePresentingVC?(): boolean;

	shouldPrioritizePanModalGestureRecognizer?(panGestureRecognizer: UIPanGestureRecognizer): boolean;

	shouldRespondToPanModalGestureRecognizer?(panGestureRecognizer: UIPanGestureRecognizer): boolean;

	shouldRoundTopCorners?(): boolean;

	shouldTransitionToState?(state: PresentationState): boolean;

	showDragIndicator?(): boolean;

	springDamping?(): number;

	topOffset?(): number;

	transitionAnimationOptions?(): UIViewAnimationOptions;

	transitionDuration?(): number;

	willRespondToPanModalGestureRecognizer?(panGestureRecognizer: UIPanGestureRecognizer): void;

	willTransitionToState?(state: PresentationState): void;
}
declare var HWPanModalPresentable: {

	prototype: HWPanModalPresentable;
};

interface HWPanModalPresenter extends NSObjectProtocol {

	isPanModalPresented: boolean;

	presentPanModal(viewControllerToPresent: UIViewController): void;

	presentPanModalSourceViewSourceRect(viewControllerToPresent: UIViewController, sourceView: UIView, rect: CGRect): void;
}
declare var HWPanModalPresenter: {

	prototype: HWPanModalPresenter;
};

declare var HWPanModalVersionNumber: number;

declare var HWPanModalVersionString: interop.Reference<number>;

interface HWPresentingViewControllerAnimatedTransitioning extends NSObjectProtocol {

	dismissAnimateTransition(transitionContext: HWPresentingViewControllerContextTransitioning): void;

	presentAnimateTransition(transitionContext: HWPresentingViewControllerContextTransitioning): void;
}
declare var HWPresentingViewControllerAnimatedTransitioning: {

	prototype: HWPresentingViewControllerAnimatedTransitioning;
};

interface HWPresentingViewControllerContextTransitioning extends NSObjectProtocol {

	containerView: UIView;

	mainTransitionDuration(): number;

	viewControllerForKey(key: string): UIViewController;
}
declare var HWPresentingViewControllerContextTransitioning: {

	prototype: HWPresentingViewControllerContextTransitioning;
};

interface PanModalHeight {
	heightType: PanModalHeightType;
	height: number;
}
declare var PanModalHeight: interop.StructType<PanModalHeight>;

declare const enum PanModalHeightType {

	Max = 0,

	MaxTopInset = 1,

	Content = 2,

	ContentIgnoringSafeArea = 3,

	Intrinsic = 4
}

declare const enum PresentationState {

	Short = 0,

	Long = 1
}

declare const enum PanIndicatorViewStyle {

	Line = 0,

	Arrow = 1
}

declare class HWPanIndicatorView extends UIView {

	static alloc(): HWPanIndicatorView; // inherited from NSObject

	static appearance(): HWPanIndicatorView; // inherited from UIAppearance

	static appearanceForTraitCollection(trait: UITraitCollection): HWPanIndicatorView; // inherited from UIAppearance

	static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): HWPanIndicatorView; // inherited from UIAppearance

	static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): HWPanIndicatorView; // inherited from UIAppearance

	static appearanceWhenContainedIn(ContainerClass: typeof NSObject): HWPanIndicatorView; // inherited from UIAppearance

	static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): HWPanIndicatorView; // inherited from UIAppearance

	static new(): HWPanIndicatorView; // inherited from NSObject

	color: UIColor;

	style: PanIndicatorViewStyle;
}