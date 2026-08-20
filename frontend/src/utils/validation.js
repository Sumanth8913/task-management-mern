export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());

export const validateAuthForm = ({ name, email, password }, requireName) => {
  const errors = {};
  if (requireName && (!name || name.trim().length < 2)) {
    errors.name = 'Name must be at least 2 characters.';
  }
  if (!email || !isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
};

export const validateTaskForm = ({ title }) => {
  const errors = {};
  if (!title || !title.trim()) {
    errors.title = 'Title is required.';
  } else if (title.trim().length > 200) {
    errors.title = 'Title must be 200 characters or fewer.';
  }
  return errors;
};
