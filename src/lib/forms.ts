export function applyFormFieldErrors<TFieldValues extends string>(
  form: { setError: (name: TFieldValues, error: { message: string }) => void },
  error: unknown,
) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  Object.entries(error as Record<string, string[]>).forEach(([key, messages]) => {
    if (messages && messages.length > 0) {
      form.setError(key as TFieldValues, { message: messages[0] });
    }
  });

  return true;
}
