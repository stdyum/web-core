import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { IconsService } from '../services/icons.service';

@Component({
  selector: 'page-wrapper',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './page-wrapper.component.html',
  styleUrl: './page-wrapper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWrapperComponent {
  header = viewChild('header', { read: ElementRef<HTMLElement> });

  private iconsService = inject(IconsService);

  constructor() {
    this.iconsService.registerDefaultIcons();

    window.addEventListener('scroll', () => this.registerScrollingFade(document.documentElement));
  }

  registerScrollingFade(el: any): void {
    const classList = this.header()?.nativeElement?.classList;
    if (!classList) return;

    const isScrollable = el.scrollHeight > el.clientHeight;
    if (!isScrollable) {
      classList.remove('scrolling-fade');
      return;
    }

    console.log(el.scrollHeight, el.clientHeight, el.scrollTop);
    classList.toggle('scrolling-fade', el.scrollTop !== 0);
  }
}
