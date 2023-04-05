export function isValidEmail(email, setError) {
  if (!/\S+@\S+\.\S+/.test(email)) {
    setError('Enter valid email');
  }
}

export function isPasswordsMatching(password, confirmPassword, setError) {
  if (password.trim() !== confirmPassword.trim()) {
    setError(() => 'Passwords do not match');
  }
}
