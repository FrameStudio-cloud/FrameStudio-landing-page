import { formatKES, lineTotal } from '../../lib/invoice'

/**
 * The line items, on paper. Shared by the invoice page and anything that later
 * needs to show the same invoice (receipt view, email preview).
 *
 * "Unit price" drops out below `sm` — on a phone the description and the amount
 * are what a customer is checking; the arithmetic is already done in the totals.
 */
export default function InvoiceItemsTable({ items = [], className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[300px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
            <th className="pb-2 text-left font-semibold">Description</th>
            <th className="w-10 pb-2 text-right font-semibold">Qty</th>
            <th className="hidden w-28 whitespace-nowrap pb-2 pl-3 text-right font-semibold sm:table-cell print:table-cell">
              Unit price
            </th>
            <th className="w-24 whitespace-nowrap pb-2 pl-3 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id ?? i} className="border-b border-slate-100 last:border-0">
              <td className="py-2.5 pr-3 text-slate-800">{item.name}</td>
              <td className="py-2.5 text-right tabular-nums text-slate-500">{item.qty}</td>
              <td className="hidden whitespace-nowrap py-2.5 pl-3 text-right tabular-nums text-slate-500 sm:table-cell print:table-cell">
                {formatKES(item.price)}
              </td>
              <td className="whitespace-nowrap py-2.5 pl-3 text-right font-medium tabular-nums text-slate-900">
                {formatKES(lineTotal(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
