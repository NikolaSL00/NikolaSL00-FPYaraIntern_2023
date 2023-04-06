export function isValidEmail(email, setError) {
  if (!/\S+@\S+\.\S+/.test(email)) {
    setError('Enter valid email');
    return false;
  }
  return true;
}

export function isPasswordsMatching(password, confirmPassword, setError) {
  if (password.trim() !== confirmPassword.trim()) {
    setError(() => 'Passwords do not match');
    return false;
  }
  return true;
}

export function isNumeric(value, fieldName, setError) {
  if (isNaN(parseFloat(value)) || !isFinite(value)) {
    setError(() => `${fieldName} should be numeric`);
    return false;
  }

  if (Number(value) === 0) {
    setError(() => `${fieldName} can not be 0`);
    return false;
  }
  return true;
}

export function isProductOrWarehouseType(value, fieldName, setError) {
  const NORMAL = 'normal';
  const HAZARDOUS = 'hazardous';

  if (value !== NORMAL && value !== HAZARDOUS) {
    setError(() => `${fieldName} can be either ${NORMAL} or ${HAZARDOUS}`);
    return false;
  }

  return true;
}
