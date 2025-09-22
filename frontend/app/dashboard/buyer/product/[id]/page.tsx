import BuyerProductDetailPage from '@/components/dashboard/buyer/buyer-product-detail';

export async function generateStaticParams() {
  return [];
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <BuyerProductDetailPage productId={params.id} />;
}