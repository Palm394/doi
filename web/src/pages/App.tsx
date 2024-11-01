import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getAllCashAccount, getAllCashAccountResponse } from "@/services/asset";
import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts";

const chartConfig = {
  current_value_thb: {
    label: 'Balance (THB)',
  },
} satisfies ChartConfig

export default function App() {
  const [cashAccount, setCashAccount] = useState<getAllCashAccountResponse['data']['cash_accounts']>([]);
  const [cashSum, setCashSum] = useState<string>('0');

  useEffect(() => {
    refresh();
  }, [])

  async function refresh() {
    const response = await getAllCashAccount();
    if (response.success && response.data) {
      setCashAccount(response.data['cash_accounts']);
      setCashSum(response.data['sum']);
    } else {
      console.error(response.message);
    }
  }

  return (
    <>
      <h1 className="text-xl font-extralight mt-4">AUM</h1>
      <div className="text-4xl font-semibold mb-4"><span>฿ {cashSum}</span>
        <span className="font-extralight text-sm">&nbsp;(Cash Only)</span>
      </div>
      <Card className="flex flex-col min-w-fit max-w-[400px]">
        <CardHeader className="pb-0">
          <CardTitle className="font-bold text-center">Cash By Account</CardTitle>
        </CardHeader>
        <CardContent className="pb-0 mx-auto flex flex-col sm:flex-row">
          <ChartContainer
            config={chartConfig}
            className="aspect-square min-h-[200px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Pie
                data={cashAccount?.map((account: any, index) => ({
                  ...account,
                  current_value_thb: Number(account.current_value_thb),
                  fill: `hsl(var(--chart-${index + 1}))`
                }))}
                nameKey="name"
                dataKey="current_value_thb"
                innerRadius={50}
              />
            </PieChart>
          </ChartContainer>
          <ul className="text-sm flex flex-col justify-center pb-4">
            {
              cashAccount?.map((account: any, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}></span>
                  <span>{account.name}</span>
                </li>
              ))
            }
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
