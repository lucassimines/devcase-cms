import slugify from "slugify";

// Convert string to camelCase
export function camelCase(value: string) {
    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert a space between camelCase words
        .split(/[_\s-]+/) // Split the string by underscores, spaces, or dashes.
        .map((word, index) => {
            if (index === 0) {
                // The first word should be all lowercase.
                return word.toLowerCase();
            } else {
                // Capitalize the first letter of each subsequent word and make the rest lowercase.
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
        })
        .join(""); // Join the words without spaces.
}

/**
 * Slugify with custom options
 */

export function toSlug(value: string) {
    return slugify
        .default(value, {
            lower: true,
            remove: /[*+~.()'"!:@]/g
        })
        .replace(/[^a-z0-9\-]/g, "");
}
