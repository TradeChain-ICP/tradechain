import SellerProductDetailPage from '@/components/dashboard/seller/seller-product-detail';

export async function generateStaticParams() {
  return [];
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <SellerProductDetailPage productId={params.id} />;
}