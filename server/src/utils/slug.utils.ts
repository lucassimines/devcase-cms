import { NotFoundError } from "@src/errors/index.js";
import type { StringFieldUpdateOperationsInput } from "@src/generated/prisma/models.js";
import type { PrismaDelegate } from "@src/types/prisma.js";

type WithSlug = {
    slug?: string | StringFieldUpdateOperationsInput;
};

/**
 * Generate model unique slug
 */
async function generateUniqueSlug(
    model: PrismaDelegate,
    slug: string,
    modelSlug: string | null = null
) {
    let slugExists = 1;
    let suffix = 0;
    let uniqueSlug = slug;

    // Check if slug has changed
    const slugHasChanged = modelSlug !== slug;

    // If slug has not been changed, return it
    if (!slugHasChanged) return slug;

    while (true) {
        if (slugExists > 1) {
            uniqueSlug = `${slug}-${suffix}`;
        }

        const existingModel = await model.findFirst({
            where: {
                slug: uniqueSlug
            }
        });

        if (!existingModel) return uniqueSlug;

        slugExists++;
        suffix++;
    }
}

/**
 * Resolves a unique slug, regenerating it only if the provided slug differs from the current stored value.
 */
async function resolveUniqueSlug(model: PrismaDelegate, id: string, inputSlug: string) {
    const item = await model.findUnique({
        where: { id }
    });

    if (!item) {
        throw new NotFoundError();
    }

    // Return a new unique slug
    return await generateUniqueSlug(model, inputSlug, item.slug);
}

export async function withUniqueSlug<T extends WithSlug>(
    model: PrismaDelegate,
    data: T,
    id?: string
): Promise<T> {
    if (!data.slug) return data;

    const normalizedSlug = data.slug.toString();

    const slug = id
        ? await resolveUniqueSlug(model, id, normalizedSlug)
        : await generateUniqueSlug(model, normalizedSlug);

    return {
        ...data,
        slug
    };
}
