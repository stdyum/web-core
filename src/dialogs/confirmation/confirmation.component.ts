import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationPipe } from '../../modules/translation/pipes/translation.pipe';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'dialog-confirmation',
  standalone: true,
  imports: [
    TranslationPipe,
    MatButton,
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
  host: {
    class: 'accent-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialog {
  private data = inject(MAT_DIALOG_DATA) ?? {};

  title = input<string>(this.data.title ?? 'dialogs_confirmation_title');
  body = input<string>(this.data.body ?? 'dialogs_confirmation_body');
  confirmButtonText = input<string>(this.data.confirmButtonText ?? 'dialogs_confirmation_confirm_button_text');
  confirmButtonColor = input<string>(this.data.confirmButtonColor);
  cancelButtonText = input<string>(this.data.cancelButtonText ?? 'dialogs_confirmation_cancel_button_text');
  cancelButtonColor = input<string>(this.data.cancelButtonColor);

  private dialog = inject(MatDialogRef);

  confirm(): void {
    this.dialog.close(1);
  }

  cancel(): void {
    this.dialog.close();
  }
}
