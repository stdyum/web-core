import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  private iconsService = inject(IconsService);

  constructor() {
    this.iconsService.registerDefaultIcons();
  }
}
