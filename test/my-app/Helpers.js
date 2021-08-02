export function normalizeName(name) {
  if (!name) return;

  if (typeof name !== 'string') return name;

  // Replace hyphens with spaces
  name = name.replace('-', ' ');

  // Replace underscores with spaces
  name = name.replace('_', ' ');

  // Capitalize first letter of every word
  name = name
    // .toLowerCase()
    .split(' ')
    .map(function(word) {
      // console.log("First capital letter: "+word[0]);
      // console.log("remain letters: "+ word.substr(1));
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');

  return name;
}
