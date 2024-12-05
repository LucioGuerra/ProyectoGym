import { AbstractControl, ValidationErrors } from "@angular/forms";

function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const passwordValue = control.value;
  if (!passwordValue) {
    return null;
  }
  const hasUpperCase = /[A-Z]+/.test(passwordValue);
  const hasLowerCase = /[a-z]+/.test(passwordValue);
  const hasNumeric = /[0-9]+/.test(passwordValue);
  const hasSpecial = /[!@#$%^&*]+/.test(passwordValue);

  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

  const validationErrors = {
    hasUpperCase: !hasUpperCase,
    hasLowerCase: !hasLowerCase,
    hasNumeric: !hasNumeric,
    hasSpecial: !hasSpecial,
  }

  return passwordValid ? null : validationErrors;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const repassword = control.value;
    if (!repassword) {
        return null;
    }
    const password = control.parent?.get('password');
    if (!password) {
        return null;
    }

    console.log(`password= ${password.value}, repassword= ${repassword}`);
    return repassword != password.value ? { mismatch: true } : null;
}

const passwordValidators = {
    passwordStrengthValidator,
    passwordMatchValidator,
};

export default passwordValidators;