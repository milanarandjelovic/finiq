export const Table = ({ children }: any) => <table>{children}</table>

export const TableBody = ({ children }: any) => <tbody>{children}</tbody>

export const TableCell = ({ children, colSpan, className, style }: any) => (
  <td colSpan={colSpan} className={className} style={style}>
    {children}
  </td>
)

export const TableHead = ({ children, colSpan, style }: any) => (
  <th colSpan={colSpan} style={style}>
    {children}
  </th>
)

export const TableHeader = ({ children }: any) => <thead>{children}</thead>

export const TableRow = ({
  children,
  className,
  'data-state': dataState,
}: any) => (
  <tr className={className} data-state={dataState}>
    {children}
  </tr>
)
