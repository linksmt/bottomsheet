import { ViewWithBottomSheetBase, applyMixins, BottomSheetOptions } from './bottomsheet-common';
import { ios, traceCategories, traceError, traceMessageType, traceWrite, View } from 'tns-core-modules/ui/core/view/view';
import { ViewBase } from 'tns-core-modules/ui/core/view-base';
import { ios as iosUtils, layout } from 'tns-core-modules/utils/utils';
import { fromObject } from 'tns-core-modules/data/observable';

declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        _setLayoutFlags(left: number, top: number, right: number, bottom: number);
    }
    namespace ios {
        interface UILayoutViewController extends UIViewController {
            owner: WeakRef<View>;
        }
    }
}

export class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    protected _showNativeBottomSheet(parent: View, options: BottomSheetOptions) {
        const parentWithController = ios.getParentWithViewController(parent);
        if (!parentWithController) {
            traceWrite(`Could not find parent with viewController for ${parent} while showing bottom sheet view.`, traceCategories.ViewHierarchy, traceMessageType.error);
            return;
        }

        const parentController = parentWithController.viewController;
        if (parentController.presentedViewController) {
            traceWrite('Parent is already presenting view controller. Close the current bottom sheet page before showing another one!', traceCategories.ViewHierarchy, traceMessageType.error);
            return;
        }

        if (!parentController.view || !parentController.view.window) {
            traceWrite('Parent page is not part of the window hierarchy.', traceCategories.ViewHierarchy, traceMessageType.error);
            return;
        }

        this._setupAsRootView({});

        super._showNativeBottomSheet(parentWithController, options);

        let controller = this.viewController;
        if (!controller) {
            const nativeView = this.ios || this.nativeViewProtected;
            controller = BottomSheetUILayoutViewController.initWithOwner(new WeakRef(this), true, () => {
                if (options.closeCallback != null) {
                    options.closeCallback();
                }
            });

            if (nativeView instanceof UIView) {
                controller.view.addSubview(nativeView);
            }

            this.viewController = controller;
        }

        this._raiseShowingBottomSheetEvent();

        (parentController as HWPanModalPresenter).presentPanModal(this.viewController);
    }

    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void) {
        if (!parent || !parent.viewController) {
            traceError('Trying to hide bottom-sheet view but no parent with viewController specified.');
            return;
        }

        // const parentController = parent.viewController;
        // const animated = (<any>this.viewController).animated;
        whenClosedCallback();
        // parentController.dismissViewControllerAnimatedCompletion(animated, whenClosedCallback);
    }
}

export function overrideBottomSheet() {
    const NSView = require('tns-core-modules/ui/core/view').View;
    applyMixins(NSView, [ViewWithBottomSheetBase, ViewWithBottomSheet]);
}
export function install() {
    overrideBottomSheet();
}

export class BottomSheetUILayoutViewController extends UIViewController implements HWPanModalPresentable {

    public owner: WeakRef<View>;
    public animated: boolean;
    public onModalDismissed: () => void;

    public static initWithOwner(owner: WeakRef<View>,
                                animated: boolean,
                                onModalDismissed: () => void): BottomSheetUILayoutViewController {

        const controller = <BottomSheetUILayoutViewController>BottomSheetUILayoutViewController.new();
        controller.owner = owner;
        controller.animated = animated;
        controller.onModalDismissed = onModalDismissed;
        return controller;

    }

    viewDidLoad() {
        super.viewDidLoad();
        console.log("viewDidLoad --->");
        this.view.backgroundColor = UIColor.yellowColor;
    }

    public viewDidLayoutSubviews(): void {
        super.viewDidLayoutSubviews();
        const owner = this.owner.get();
        if (owner) {
            this.layoutView(this, owner);
        }
    }

    public viewWillAppear(animated: boolean): void {
        super.viewWillAppear(animated);
        const owner = this.owner.get();
        if (!owner) {
            return;
        }

        ios.updateAutoAdjustScrollInsets(this, owner);

        if (!owner.parent) {
            owner.callLoaded();
        }
    }

    initLayoutGuide(controller: UIViewController) {
        const rootView = controller.view;
        const layoutGuide = UILayoutGuide.alloc().init();
        rootView.addLayoutGuide(layoutGuide);
        NSLayoutConstraint.activateConstraints(<any>[
            layoutGuide.topAnchor.constraintEqualToAnchor(controller.topLayoutGuide.bottomAnchor),
            layoutGuide.bottomAnchor.constraintEqualToAnchor(controller.bottomLayoutGuide.topAnchor),
            layoutGuide.leadingAnchor.constraintEqualToAnchor(rootView.leadingAnchor),
            layoutGuide.trailingAnchor.constraintEqualToAnchor(rootView.trailingAnchor)
        ]);
        return layoutGuide;
    }

    layoutView(controller: UIViewController, owner: View): void {
        let layoutGuide = controller.view.safeAreaLayoutGuide;
        if (!layoutGuide) {
            traceWrite(`safeAreaLayoutGuide during layout of ${owner}. Creating fallback constraints, but layout might be wrong.`, traceCategories.Layout, traceMessageType.error);

            layoutGuide = this.initLayoutGuide(controller);
        }
        const safeArea = layoutGuide.layoutFrame;
        let position = ios.getPositionFromFrame(safeArea);
        const safeAreaSize = safeArea.size;

        const hasChildViewControllers = controller.childViewControllers.count > 0;
        if (hasChildViewControllers) {
            const fullscreen = controller.view.frame;
            position = ios.getPositionFromFrame(fullscreen);
        }

        const safeAreaWidth = layout.round(layout.toDevicePixels(safeAreaSize.width));
        const safeAreaHeight = layout.round(layout.toDevicePixels(safeAreaSize.height));

        const widthSpec = layout.makeMeasureSpec(safeAreaWidth, layout.EXACTLY);
        const heightSpec = layout.makeMeasureSpec(safeAreaHeight, layout.UNSPECIFIED);

        View.measureChild(null, owner, widthSpec, heightSpec);
        View.layoutChild(null, owner, position.left, position.top, position.right, position.top + owner.getMeasuredHeight());

        this.preferredContentSize = CGSizeMake(layout.toDeviceIndependentPixels(owner.getMeasuredWidth()),
                                                position.top + layout.toDeviceIndependentPixels(owner.getMeasuredHeight()));

        this.layoutParent(owner.parent);
    }

    layoutParent(view: ViewBase): void {
        if (!view) {
            return;
        }

        if (view instanceof View && view.nativeViewProtected) {
            const frame = view.nativeViewProtected.frame;
            const origin = frame.origin;
            const size = frame.size;
            const left = layout.toDevicePixels(origin.x);
            const top = layout.toDevicePixels(origin.y);
            const width = layout.toDevicePixels(size.width);
            const height = layout.toDevicePixels(size.height);
            view._setLayoutFlags(left, top, width + left, height + top);
        }

        this.layoutParent(view.parent);
    }

    public viewDidDisappear(animated: boolean): void {
        super.viewDidDisappear(animated);
        const owner = this.owner.get();
        if (owner && !owner.parent) {
            owner.callUnloaded();
        }
    }

    shortFormHeight(): PanModalHeight {
        let pan = new PanModalHeight();
        pan.height = 200;
        pan.heightType = PanModalHeightType.Content;
        return pan;
    }

    backgroundBlurRadius?(): number {
        return 5;
    }

    backgroundBlurColor?(): UIColor {
        return UIColor.blackColor;
    }

    showDragIndicator?(): boolean {
        return true;
    }

    customDragIndicator?(): HWPanIndicatorView {
        return HWCustomPanIndicatorView.alloc().init();
    }

    transitionAnimationOptions(): UIViewAnimationOptions {
        return this.animated ? UIViewAnimationOptions.CurveEaseIn : UIViewAnimationOptions.TransitionNone;
    }

    panModalDidDismissed?(): void {

    }
}

export class HWCustomPanIndicatorView extends HWPanIndicatorView {

    get style(): PanIndicatorViewStyle {
        return PanIndicatorViewStyle.Line;
    }
    set style(value: PanIndicatorViewStyle) {
    }

}