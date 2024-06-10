import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../service/translation.service';

@Pipe({
  name: 'translation',
  standalone: true,
  pure: false,
})
export class TranslationPipe implements PipeTransform {

  private translationService = inject(TranslationService);

  transform(value?: string): string {
    if (!value) return '';

    return this.translationService.getTranslation(value)();
  }
}
