import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 
interface CSVTableProps {
  csvData: Papa.ParseResult<any>
  headers: string[]
}
 
function CSVTable({csvData, headers}: CSVTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((label, index) => 
            <TableHead key={index}>{label}</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {csvData.data.map((data, index) => (
          <TableRow key={index}>
            {headers.map((header, index) => 
              <TableCell key={index}>{data[header]}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default CSVTable;
