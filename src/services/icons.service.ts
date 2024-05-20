import { inject, Injectable } from '@angular/core';
import { MatIconRegistry, SafeResourceUrlWithIconOptions } from '@angular/material/icon';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  registerDefaultIcons(): void {
    this.matIconRegistry.addSvgIconResolver(this.resolver.bind(this))
  }

  private resolver(name: string, namespace: string): SafeResourceUrl | SafeResourceUrlWithIconOptions | null {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`icons/${namespace}/${name}.svg`);
  }
}
