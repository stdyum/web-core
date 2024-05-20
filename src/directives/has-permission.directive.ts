import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { filter, map, Subscription } from 'rxjs';
import { EnrollmentsService } from '../modules/studyplaces/services/enrollments.service';
import { LoadedState } from '@likdan/state-mapper';
import { Enrollment } from '../modules/studyplaces/models/enrollments.models';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'hasPermission' }) permission!: string;

  private enrollmentsService = inject(EnrollmentsService);
  private permissionSubscription?: Subscription;

  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);
  private embeddedView: EmbeddedViewRef<any> | null = null;

  ngOnInit(): void {
    this.permissionSubscription = this.enrollmentsService.currentEnrollmentState
      .pipe(filter(s => s.state === 'loaded'))
      .pipe(map(s => (s as LoadedState<Enrollment>).data))
      .pipe(map(e => e.permissions))
      .pipe(filter(p => p.includes(this.permission) || p.includes('admin')))
      .subscribe(this.placeItem.bind(this));
  }

  ngOnDestroy(): void {
    this.permissionSubscription?.unsubscribe();
  }

  private placeItem(): void {
    this.embeddedView?.destroy();
    this.embeddedView = this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.embeddedView.detectChanges();
  }
}
