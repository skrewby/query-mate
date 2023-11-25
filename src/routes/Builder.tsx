import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CSVEditor from "@/pages/builder/CSVEditor";
import UpdateForm from "@/pages/builder/UpdateForm";
import { useState } from "react";

function getHeaders(csvData: Papa.ParseResult<any>): string[] {
  if(csvData.meta.fields === undefined) {
    return Array.from(Array(csvData.data[0].length).keys()).map(String);
  } else {
    return csvData.meta.fields;
  }
}

function Builder() {
  const [csv, setCSV] = useState<Papa.ParseResult<any> | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);

  const tabs = [
    {
      id: 0,
      value: "update",
      label: "Update",
      element: <UpdateForm csv={csv} headers={headers} /> 
    },
    {
      id: 1,
      value: "insert",
      label: "Insert",
      element: <h1> Insert </h1>
    },
  ];

  const csvUpdate = (result: Papa.ParseResult<any>) => {
    setCSV(result);
    setHeaders(getHeaders(result));
  }

  return (
    <>
      <div className="flex-1 mx-auto max-w-[1000px] space-y-8 p-8 pt-4 pb-2">
        <Tabs defaultValue="update" className="min-h-[500px]">
          <TabsList>
            {tabs.map(tab => 
              <TabsTrigger value={tab.value} key={tab.id}>
                {tab.label}
              </TabsTrigger>
            )}
          </TabsList>
          {tabs.map((tab) => 
            <TabsContent key={tab.id} value={tab.value}>{tab.element}</TabsContent>
          )}
        </Tabs>
        <CSVEditor csv={csv} headers={headers} onUpdate={csvUpdate}/>
      </div>
    </>
  );
};

export default Builder 
