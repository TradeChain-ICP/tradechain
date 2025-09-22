import EditProductForm from '@/components/dashboard/seller/edit-product-form';

export async function generateStaticParams() {
  return [];
}

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return <EditProductForm productId={params.id} />;
}