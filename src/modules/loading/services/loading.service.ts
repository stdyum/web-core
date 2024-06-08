import { ComponentRef, effect, inject, Injectable, signal } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingComponent } from '../components/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private stackAmount = signal(0);

  private overlayRef: ComponentRef<LoadingComponent> | null = null;
  private overlay = inject(Overlay);

  private overlayConfig: OverlayConfig = {
    hasBackdrop: true,
    positionStrategy: new GlobalPositionStrategy().centerVertically().centerHorizontally(),
  };

  constructor() {
    effect(() => {
      const stackAmount = this.stackAmount();
      if (!this.overlayRef && stackAmount !== 0) {
        this.showLoadingComponent();
      }

      if (this.overlayRef && stackAmount === 0) {
        this.hideLoadingComponent();
      }
    });
  }

  appendLoading(): void {
    this.stackAmount.update(v => v + 1);
  }

  removeLoading(): void {
    this.stackAmount.update(v => v - 1);
  }

  private showLoadingComponent(): void {
    const loadingComponentPortal = new ComponentPortal(LoadingComponent);
    this.overlayRef = this.overlay.create(this.overlayConfig).attach(loadingComponentPortal);
  }

  private hideLoadingComponent(): void {
    this.overlayRef!.destroy();
    this.overlayRef = null
  }
}
