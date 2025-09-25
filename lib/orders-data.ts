import type { Order } from "./orders-types";

export const db: { orders: Order[] } = {
    orders: [
        { id:"o-111", orderNumber:"ORD-2025-0001", customer:"Acme Sp. z o.o.",  status:"new",        dueDate:"2025-10-05", totalGross:1999.99 },
        { id:"o-112", orderNumber:"ORD-2025-0002", customer:"Pixel Media",      status:"processing", dueDate:"2025-10-18", totalGross:849.50  },
        { id:"o-113", orderNumber:"ORD-2025-0003", customer:"GenericITCompany", status:"new",        dueDate:"2025-11-02", totalGross:1250.00 },
        { id:"o-114", orderNumber:"ORD-2025-0004", customer:"NextGen Apps",     status:"shipped",    dueDate:"2025-09-29", totalGross:4320.75 },
        { id:"o-115", orderNumber:"ORD-2025-0005", customer:"UX Studio",        status:"delivered",  dueDate:"2025-09-20", totalGross:650.00  },
        { id:"o-116", orderNumber:"ORD-2025-0006", customer:"Creative Minds",   status:"cancelled",  dueDate:"2025-10-10", totalGross:299.99  },
        { id:"o-117", orderNumber:"ORD-2025-0007", customer:"CodeWorks",        status:"processing", dueDate:"2025-10-15", totalGross:780.00  },
        { id:"o-118", orderNumber:"ORD-2025-0008", customer:"Bright Agency",    status:"new",        dueDate:"2025-11-05", totalGross:1530.25 },
        { id:"o-119", orderNumber:"ORD-2025-0009", customer:"Studio Alfa",      status:"shipped",    dueDate:"2025-09-30", totalGross:425.40  },
        { id:"o-120", orderNumber:"ORD-2025-0010", customer:"Techify",          status:"processing", dueDate:"2025-10-22", totalGross:2500.00 },
        { id:"o-121", orderNumber:"ORD-2025-0011", customer:"BlueSoft",         status:"delivered",  dueDate:"2025-09-28", totalGross:999.00  },
        { id:"o-122", orderNumber:"ORD-2025-0012", customer:"Rocket Digital",   status:"new",        dueDate:"2025-11-12", totalGross:1780.50 },
        { id:"o-123", orderNumber:"ORD-2025-0013", customer:"MediaCraft",       status:"processing", dueDate:"2025-10-14", totalGross:300.00  },
        { id:"o-124", orderNumber:"ORD-2025-0014", customer:"Northwind",        status:"shipped",    dueDate:"2025-09-27", totalGross:750.25  },
        { id:"o-125", orderNumber:"ORD-2025-0015", customer:"DesignHub",        status:"new",        dueDate:"2025-11-01", totalGross:1899.99 },
        { id:"o-126", orderNumber:"ORD-2025-0016", customer:"Startup Garage",   status:"processing", dueDate:"2025-10-25", totalGross:1425.00 },
        { id:"o-127", orderNumber:"ORD-2025-0017", customer:"LightHouse Inc.",  status:"cancelled",  dueDate:"2025-09-21", totalGross:560.00  },
        { id:"o-128", orderNumber:"ORD-2025-0018", customer:"AppVision",        status:"delivered",  dueDate:"2025-09-19", totalGross:2750.75 },
        { id:"o-129", orderNumber:"ORD-2025-0019", customer:"SkyTech",          status:"new",        dueDate:"2025-11-20", totalGross:3200.00 },
        { id:"o-130", orderNumber:"ORD-2025-0020", customer:"FastTrack",        status:"processing", dueDate:"2025-10-28", totalGross:400.00  }
    ]
};

export function validateOrder(input: Partial<Order>) {
    const errors: Record<string, string> = {};
    const allowed = new Set(["new","processing","shipped","delivered","cancelled"]);
    if (!input.orderNumber || input.orderNumber.length < 6) errors.orderNumber = "Wymagane, min. 6 znaków.";
    if (!input.customer || input.customer.trim().length === 0) errors.customer = "Wymagane.";
    if (!input.status || !allowed.has(input.status)) errors.status = "Niedozwolona wartość.";
    if (!input.dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) errors.dueDate = "Format YYYY-MM-DD.";
    if (input.totalGross == null || Number(input.totalGross) <= 0) errors.totalGross = "Kwota > 0.";
    return errors;
}