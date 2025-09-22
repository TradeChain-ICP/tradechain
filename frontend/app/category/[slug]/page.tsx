import CategorySlugPage from '@/components/category/category-slug';

export async function generateStaticParams() {
  return [];
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategorySlugPage slug={params.slug} />;
}