import { computed, Directive, effect, ElementRef, HostListener, inject, input } from '@angular/core';
import { RedirectService } from '../services/redirect.service';
import { Router } from '@angular/router';

@Directive({
  selector: '[redirectLink]',
  standalone: true,
})
export class RedirectLinkDirective {
  subdomain = input<string>('', { alias: 'redirectLink' });
  url = input<string>('');

  private elementRef = inject(ElementRef);
  private router = inject(Router);
  private redirectService = inject(RedirectService);

  private useInternalRouter = computed(() => {
    const currentSubdomain = window.location.hostname.split('.')[0];
    const subdomain = this.subdomain();
    const isValidDomain = this.redirectService.isValidDomain();

    return subdomain === '' || currentSubdomain === subdomain || !isValidDomain;
  });

  constructor() {
    effect(() => {
      const subdomain = this.subdomain();
      const url = this.url();

      const href = this.redirectService.generateRedirectUrl(subdomain, url);
      if (!href) return;

      this.setNativeUrl(href);
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): Promise<boolean> | null {
    if (event.metaKey || event.ctrlKey || !this.useInternalRouter()) return null;

    event.preventDefault();
    const url = this.url();
    return this.router.navigate([url]);
  }

  private setNativeUrl(url: string): void {
    const host = this.elementRef.nativeElement;
    host.setAttribute('href', url);
  }
}
