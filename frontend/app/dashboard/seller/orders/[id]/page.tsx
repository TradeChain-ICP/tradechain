import SellerOrderDetailPage from '@/components/dashboard/seller/seller-order-detail';

export async function generateStaticParams() {
  return [];
}

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  return <SellerOrderDetailPage orderId={params.id} />;
}