import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";
import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";

interface SummaryCardProps {
  month?: string;
}

const SummaryCards = async ({ month }: SummaryCardProps) => {
  const getYear = () => {
    const date = new Date();
    return date.getFullYear();
  };

  const where = {
    date: {
      gte: new Date(`${getYear()}-${month}-01`),
      lt: new Date(`${getYear()}-${month}-31`),
    },
  };

  const depositTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: TransactionType.DEPOSIT },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const investmentTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: TransactionType.INVESTMENT },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const balance = depositTotal - investmentTotal - expensesTotal;
  return (
    <div className="space-y-6">
      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        amount={balance}
        size="large"
      />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={16} />}
          title="Investido"
          amount={investmentTotal}
        />
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receita"
          amount={depositTotal}
        />
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title="Despesas"
          amount={expensesTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
