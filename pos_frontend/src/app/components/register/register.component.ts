import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../core/services/auth/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  @Output() registerSuccess = new EventEmitter<void>(); // ✅ Emit event to parent

  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.registerService.registerUser(this.registerForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.loading = false;
        this.registerForm.reset();

        // ✅ Emit event after short delay (to allow message to show)
        setTimeout(() => {
          this.registerSuccess.emit();
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
