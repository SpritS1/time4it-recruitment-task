import OrdersTable from "../components/orders-table";
import { UserAvatar } from "@/components/user-avatar";
import { getOrders } from "@/lib/data/orders";
import { SortOrder } from "@/lib/orders-types";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    sortField?: string;
    sortOrder?: SortOrder;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";
  const sortField = params.sortField || "dueDate";

  const data = await getOrders({
    page: currentPage,
    sortField,
    sortOrder,
  });

  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[1216px] w-full overflow-hidden mx-auto">
        <UserAvatar />

        <div className="w-full">
          <OrdersTable
            data={data}
            sortField={sortField}
            sortOrder={sortOrder}
            currentPage={currentPage}
          />
        </div>
      </main>
    </div>
  );
}
