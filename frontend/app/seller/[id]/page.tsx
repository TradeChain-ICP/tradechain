import SellerDetailPage from '@/components/seller/seller-detail';

export async function generateStaticParams() {
  return [];
}

interface SellerPageProps {
  params: {
    id: string;
  };
}

export default function SellerPage({ params }: SellerPageProps) {
  return <SellerDetailPage sellerId={params.id} />;
}