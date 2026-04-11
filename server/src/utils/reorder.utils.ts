import type { PrismaDelegate } from "@src/types/prisma.js";

type Item = {
    id: string;
    order: number;
};

export async function reorder<T extends PrismaDelegate>(model: T, items: Item[]) {
    const updatePromises = items.map(async (item) => {
        const data: Record<string, any> = { order: item.order };

        await model.update({
            where: { id: item.id },
            data
        });
    });

    return await Promise.all(updatePromises);
}
