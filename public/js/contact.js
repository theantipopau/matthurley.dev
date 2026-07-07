function initCopyEmail() {
  const copyEmailButton = document.getElementById('copy-email');
  if (!copyEmailButton) return;

  copyEmailButton.addEventListener('click', async () => {
    const email = 'matt@matthurley.dev';
    try {
      await navigator.clipboard.writeText(email);
      const originalText = copyEmailButton.textContent;
      copyEmailButton.textContent = 'Copied';
      setTimeout(() => {
        copyEmailButton.textContent = originalText;
      }, 1400);
    } catch {
      copyEmailButton.textContent = email;
    }
  });
}

document.addEventListener('astro:page-load', initCopyEmail);
