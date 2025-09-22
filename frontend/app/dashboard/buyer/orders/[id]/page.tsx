import BuyerOrderDetailPage from '@/components/dashboard/buyer/buyer-order-detail';

export async function generateStaticParams() {
  return [];
}

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  return <BuyerOrderDetailPage orderId={params.id} />;
}