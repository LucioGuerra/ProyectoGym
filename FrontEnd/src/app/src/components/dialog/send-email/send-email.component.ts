import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendEmailComponent {
  constructor(
    public dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

