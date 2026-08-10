import { useState } from 'react';

export function useRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'personal',
    organization: '',
  });

  return {
    formData,
  };
}
