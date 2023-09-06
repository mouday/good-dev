export function copyText(text) {
  const input = document.createElement("textarea");
  input.value = text;
  document.body.appendChild(input);
  input.focus();
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}
