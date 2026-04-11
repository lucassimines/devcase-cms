type SluggableModel<T> = T & { slug: string };

export interface SluggableRepositoryInterface<T> {
    findById(id: string): Promise<SluggableModel<T> | null>;
    findBySlug(slug: string): Promise<SluggableModel<T> | null>;
}
