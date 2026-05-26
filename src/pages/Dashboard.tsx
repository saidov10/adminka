import { TrendingUp, HandCoins, DollarSign } from "lucide-react";

export default function Dashboard() {
  
  const stats = [
    {
      title: "Sales",
      value: "$152k",
      icon: HandCoins,
      bgColor: "bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400",
    },
    {
      title: "Cost",
      value: "$99.7k",
      icon: DollarSign,
      bgColor: "bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400",
    },
    {
      title: "Profit",
      value: "$32.1k",
      icon: TrendingUp,
      bgColor: "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400",
    },
  ];

  
  const transactions = [
    { name: "Jagarnath S.", date: "24.05.2023", amount: "$124.97", status: "Paid" },
    { name: "Anand G.", date: "23.05.2023", amount: "$55.42", status: "Pending" },
    { name: "Kartik S.", date: "23.05.2023", amount: "$89.90", status: "Paid" },
    { name: "Rakesh S.", date: "22.05.2023", amount: "$144.94", status: "Pending" },
    { name: "Anup S.", date: "22.05.2023", amount: "$70.52", status: "Paid" },
    { name: "Jimmy P.", date: "22.05.2023", amount: "$70.52", status: "Paid" },
  ];

  
  const topSelling = [
    { title: "Healthcare Erbology", category: "Accessories", sales: "13,153" },
    { title: "Healthcare Erbology", category: "Accessories", sales: "13,153" },
    { title: "Healthcare Erbology", category: "Accessories", sales: "13,153" },
    { title: "Healthcare Erbology", category: "Accessories", sales: "13,153" },
    { title: "Healthcare Erbology", category: "Accessories", sales: "13,153" },
  ];

  
  const unitsSold = [
    { name: "Men Grey Hoodie", initials: "MG", price: "$49.90", units: 204 },
    { name: "Women Striped T-Shirt", initials: "WS", price: "$34.90", units: 155 },
    { name: "Wome White T-Shirt", initials: "WW", price: "$40.90", units: 120 },
    { name: "Men White T-Shirt", initials: "MW", price: "$49.90", units: 204 },
    { name: "Women Red T-Shirt", initials: "WR", price: "$34.90", units: 155 },
  ];

  
  const ProductIcon = () => (
    <div className="w-10 h-10 rounded bg-[#eff6ff] dark:bg-blue-950/30 flex items-center justify-center overflow-hidden shrink-0 border border-blue-100 dark:border-blue-900/30">
      <svg className="w-6 h-7 text-blue-600 dark:text-blue-400" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="1" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
        <rect x="10" y="4" width="4" height="2" fill="currentColor" opacity="0.6" />
        <rect x="5" y="6" width="14" height="21" rx="2" fill="currentColor" />
      
        <rect x="7" y="10" width="10" height="11" rx="0.5" fill="currentColor" className="text-white dark:text-[#1c2434]" opacity="0.9" />
      </svg>
    </div>
  );

  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Dashboard
        </h2>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1c2434] rounded-xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md"
            >
              <div className={`p-3.5 rounded-xl ${stat.bgColor}`}>
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-2 space-y-6">
        
          <div className="bg-white dark:bg-[#1c2434] rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative">
            <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-6">
              Sales Revenue
            </h3>

          
            <div className="relative h-[240px] w-full">
             
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: "calc(30px + 4 * (100% - 60px) / 11)",
                  top: "110px",
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="relative mb-3 bg-[#1e293b] dark:bg-slate-900 text-white px-3 py-1.5 rounded-md shadow-lg text-center min-w-[100px] border border-slate-700 dark:border-slate-800">
                  <div className="text-[11px] font-bold whitespace-nowrap">864 Orders</div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500">May</div>
                
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e293b] dark:border-t-slate-900"></div>
                </div>
              </div>

              
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

               
                {[20, 50, 80, 110, 140, 170].map((yVal, i) => (
                  <line
                    key={i}
                    x1="30"
                    y1={yVal}
                    x2="580"
                    y2={yVal}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800/60"
                    strokeDasharray="3,3"
                  />
                ))}

               
                {[50, 40, 30, 20, 10, 0].map((label, i) => {
                  const yVal = 20 + i * 30;
                  return (
                    <text
                      key={i}
                      x="18"
                      y={yVal + 3}
                      textAnchor="end"
                      className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500 font-sans"
                    >
                      {label}
                    </text>
                  );
                })}

               
                <path
                  d="M 30,140 L 80,155 L 130,134 L 180,152 L 230,110 L 280,122 L 330,104 L 380,26 L 430,44 L 480,95 L 530,95 L 580,80 L 580,170 L 30,170 Z"
                  fill="url(#colorSales)"
                />

               
                <path
                  d="M 30,140 L 80,155 L 130,134 L 180,152 L 230,110 L 280,122 L 330,104 L 380,26 L 430,44 L 480,95 L 530,95 L 580,80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

               
                <line
                  x1="230"
                  y1="110"
                  x2="230"
                  y2="170"
                  stroke="#3b82f6"
                  strokeDasharray="3,3"
                  strokeWidth="1.5"
                />

               
                <circle cx="230" cy="110" r="6" fill="#3b82f6" className="stroke-white dark:stroke-[#1c2434]" strokeWidth="2" />

               
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                  (label, i) => {
                    const xVal = 30 + i * 50;
                    return (
                      <text
                        key={i}
                        x={xVal}
                        y="192"
                        textAnchor="middle"
                        className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500 font-sans"
                      >
                        {label}
                      </text>
                    );
                  }
                )}
              </svg>
            </div>
          </div>

         
          <div className="bg-white dark:bg-[#1c2434] rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-4">
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Name
                    </th>
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Date
                    </th>
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Amount
                    </th>
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {tx.name}
                      </td>
                      <td className="py-3.5 text-sm text-slate-400 dark:text-slate-400 font-medium">
                        {tx.date}
                      </td>
                      <td className="py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {tx.amount}
                      </td>
                      <td className="py-3.5 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold select-none ${
                            tx.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-[#eef2f6] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      
        <div className="space-y-6">
         
          <div className="bg-white dark:bg-[#1c2434] rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800 dark:text-white text-base">
                  Top selling products
                </h3>
                <a
                  href="#see-all"
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  See All
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>

              <div className="space-y-4">
                {topSelling.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <ProductIcon />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                          {prod.title}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">
                          in {prod.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {prod.sales}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                        in sales
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

         
          <div className="bg-white dark:bg-[#1c2434] rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-4">
              Top Products by Units Sold
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Name
                    </th>
                    <th className="py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 text-center">
                      Price
                    </th>
                    <th className="py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 text-right">
                      Units
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {unitsSold.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {prod.initials}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                          {prod.name}
                        </span>
                      </td>
                      <td className="py-3 text-xs font-bold text-slate-800 dark:text-slate-200 text-center">
                        {prod.price}
                      </td>
                      <td className="py-3 text-xs font-bold text-slate-800 dark:text-slate-200 text-right">
                        {prod.units}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}