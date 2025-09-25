import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import OrdersTable from "../components/orders-table/orders-table";
import { ApiList, Order } from "@/lib/orders-types";

const perPage = 7;

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);

  const res = await fetch(
    `${baseUrl}/api/orders?page=${currentPage}&perPage=${perPage}`
  );

  const data: ApiList<Order> = await res.json();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <AvatarLabelGroup
            size="xl"
            src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
            alt="User Avatar"
            title="Witaj ponownie, Olivia"
            subtitle={new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
        </div>
        <OrdersTable data={data} />
      </main>
    </div>
  );
}
