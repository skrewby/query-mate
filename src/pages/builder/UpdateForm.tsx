import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { PopoverAnchor, PopoverPortal } from "@radix-ui/react-popover"

interface FormProps {
  csv: Papa.ParseResult<any> | null,
  headers: string[]
}
 
const formSchema = z.object({
  tablename: z.string().min(1).max(255),
  setfields: z.array(z.object({ column: z.string().min(1).max(32), value: z.string().min(1) })).min(1),
  wherefields: z.array(z.object({ condition: z.string().min(1).max(32), value: z.string().min(1) })),
  wherecustom: z.string().max(1024),
});

type setFieldsType = z.infer<typeof formSchema>["setfields"];
type whereFieldsType = z.infer<typeof formSchema>["wherefields"];

function BuildQuery(data: JSON,table: string, setFields: setFieldsType, whereFields: whereFieldsType, whereCustom: string): string {
  var query = `UPDATE ${table} SET`;
  setFields.map((set, index) => {
    if(index != 0) {
      query += ','; 
    }
    const setValue = data[set.value];
    query += ` ${set.column} = '${setValue}'`;
  });
  query += ' WHERE';

  whereFields.map((val, index) => {
    if(index != 0) {
      query += ' AND'; 
    }
    const whereValue = data[val.value];
    query += ` ${val.condition} = '${whereValue}'`;
  });

  if(whereCustom.length > 0) {
    if(whereFields.length > 0) {
      query += ' AND';
    }
    query += ` ${whereCustom}`;
  }

  query += `;`;

  return query;
}

function UpdateForm({csv, headers}: FormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tablename: "",
      setfields: [{column: "", value: ""}],
      wherefields: [{condition: "", value: ""}],
      wherecustom: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "setfields",
    control: form.control
  });

  const { fields: whereFields, append: whereAppend, remove: whereRemove } = useFieldArray({
    name: "wherefields",
    control: form.control
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if(showPreview) {
      const query = BuildQuery(csv?.data[0], values.tablename, values.setfields, values.wherefields, values.wherecustom);
      setPreview(query);
    } else {
      var query = "";
      csv?.data.map((row) => {
        const rowQuery = BuildQuery(row, values.tablename, values.setfields, values.wherefields, values.wherecustom);
        query += `${rowQuery}\n`;
      });

      const element = document.createElement("a");
      const file = new Blob([query], {type: 'text/csv'});
      element.href = URL.createObjectURL(file);
      element.download = "queries.sql";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-3">
          <FormField
            control={form.control}
            name="tablename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Table</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label>SET</Label>
          <div className="border border-dashed p-4 flex flex-col gap-y-4">
            {fields.map((field, index) => ( 
              <div key={field.id} className="flex gap-x-8">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`setfields.${index}.column`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Column 
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          Database column name 
                        </FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}/>
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`setfields.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Value 
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          The value from the CSV to use
                        </FormDescription>
                        <div className="flex">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select CSV Column" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {headers.map((header, index) =>
                                <SelectItem key={index} value={header}>{header}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <Button type="button" size="sm" className="flex-none bg-background text-destructive hover:bg-background px-0 mx-4" onClick={() => remove(index)}><XCircle /></Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
              </div>
            ))}
            <Button type="button" size="sm" className="m-auto sm bg-background text-foreground hover:bg-background p-2" onClick={() => append({column: "", value: ""})}><PlusCircle /></Button>
          </div>

          <Label>WHERE</Label>
          <div className="border border-dashed p-4 flex flex-col gap-y-4">
            {whereFields.map((field, index) => ( 
              <div key={field.id} className="flex gap-x-8">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`wherefields.${index}.condition`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Column 
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          Database column name 
                        </FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}/>
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`wherefields.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Value 
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          The value from the CSV to use
                        </FormDescription>
                        <div className="flex">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select CSV Column" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {headers.map((header, index) =>
                                <SelectItem key={index} value={header}>{header}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <Button type="button" size="sm" className="flex-none bg-background text-destructive hover:bg-background px-0 mx-4" onClick={() => whereRemove(index)}><XCircle /></Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
              </div>
            ))}
            <Button type="button" size="sm" className="m-auto sm bg-background text-foreground hover:bg-background p-2" onClick={() => whereAppend({condition: "", value: ""})}><PlusCircle /></Button>
          </div>

          <FormField
            control={form.control}
            name="wherecustom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WHERE Custom</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-x-2 flex justify-end">
            <Popover>
              <PopoverTrigger><Button type="submit" onClick={() => setShowPreview(true)}>Preview</Button></PopoverTrigger>
              <PopoverContent className="w-[calc(100vh-10px)] bg-secondary mx-auto">{preview}</PopoverContent>
            </Popover>
            <Button type="submit" onClick={() => setShowPreview(false)}>Download File</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default UpdateForm;
