document.querySelectorAll('[data-toggle-password]').forEach(button => button.addEventListener('click', () => {
  const field = document.getElementById(button.dataset.togglePassword);
  if (!field) return;
  const shown = field.type === 'password';
  field.type = shown ? 'text' : 'password';
  button.textContent = shown ? 'Masquer' : 'Afficher';
  button.setAttribute('aria-label', shown ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  button.setAttribute('aria-pressed', String(shown));
}));
const photoInput = document.querySelector('#support-photo');
const preview = document.querySelector('#photo-preview');
let previewUrl;
photoInput?.addEventListener('change', () => {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  const file = photoInput.files?.[0];
  preview.hidden = true;
  const name = document.querySelector('#photo-name');
  if (name) name.textContent = file ? file.name : 'Aucune photo choisie';
  if (!file) return;
  if (file.size > 2000000 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    photoInput.setCustomValidity('Choisissez une image JPEG, PNG ou WebP de moins de 2 Mo.');
    photoInput.reportValidity();
    return;
  }
  photoInput.setCustomValidity('');
  previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.hidden = false;
});
window.addEventListener('pagehide', () => { if (previewUrl) URL.revokeObjectURL(previewUrl); });
