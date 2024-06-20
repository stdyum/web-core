import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  hostname = signal<string>(window.location.hostname);
  scheme = signal<string>(window.location.protocol);
  port = signal<string>(window.location.port);
  domain = computed(() => {
    const subdomains = this.hostname().split('.');
    return subdomains.length < 2 ? this.hostname() : subdomains[subdomains.length - 2] + '.' + subdomains[subdomains.length - 1];
  });
  isValidDomain = computed(() => this.hostname().split('.').length >= 2);

  private router = inject(Router);

  redirect(subdomain: string = '', url: string = ''): boolean {
    const href = this.generateRedirectUrl(subdomain, url);
    if (!href || window.location.href === href) return false;

    if (href.startsWith(window.location.origin)) {
      this.router.navigate(['/']).then();
      return true;
    }

    window.location.href = href;
    return true;
  }

  generateRedirectUrl(subdomain: string, url: string = ''): string | null {
    const host = this.generateRedirectHostWithPort(subdomain);
    if (!host) return null;

    return `${host}/${url}`;
  }

  generateRedirectHostWithPort(subdomain: string): string | null {
    const host = this.generateRedirectHost(subdomain);
    if (!host) return null;

    const port = this.port();
    return !port ? host : `${host}:${port}`;
  }

  generateRedirectHost(subdomain: string): string | null {
    const domain = this.domain();
    const isValidDomain = this.isValidDomain();
    const scheme = this.scheme();

    return !subdomain || !isValidDomain ? `${scheme}//${domain}` : `${scheme}//${subdomain}.${domain}`;
  }
}
