export function generateSlug(title) {
  return title
    .toLowerCase()                // Convert to lowercase
    .trim()                        // Remove leading and trailing spaces
    .replace(/[^a-z0-9\s-]/g, '')  // Remove all non-alphanumeric characters (except spaces and hyphens)
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-');          // Replace multiple hyphens with a single hyphen
}