import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, useEffect, useState } from "react";
import Papa from 'papaparse';
import CSVTable from "./CSVTable";
import { Switch } from "@/components/ui/switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface EditorProps {
  csv: Papa.ParseResult<any> | null, 
  headers: string[],
  onUpdate(result: Papa.ParseResult<any>):void
}

function CSVEditor({csv, headers, onUpdate}: EditorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [hasHeaders, setHasHeaders] = useState(true);

  const onChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  useEffect(() => {
     if(file) {
      Papa.parse(file, {
        skipEmptyLines: true,
        header: hasHeaders,
        complete: function(results) {
          onUpdate(results);
        }
      }); 
    }
  }, [file, hasHeaders]);

  return (
    <>
      <div className="grid space-y-0 gap-y-2">
        <Label htmlFor="csv-input">CSV File</Label>
        <div className="flex gap-x-2">
          <Input id="csv-input" type="file" onChange={onChange} accept="text/csv"
            className="cursor-pointer text-foreground pb-9 flex-auto
              file:mr-4 file:px-2 file:py-1 
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-secondary file:text-foreground" />
          <div className="flex items-center space-x-2 flex-none">
            <Label htmlFor="header-toggle">Headers</Label>
            <Switch id="header-toggle" checked={hasHeaders} onCheckedChange={(checked) => setHasHeaders(checked)}/>
          </div>
        </div>
        {csv && 
          <ScrollArea className="max-h-[calc(100vh-90px)] border rounded">
            <CSVTable csvData={csv} headers={headers} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        }
      </div>
    </>
  );
  }

export default CSVEditor;
