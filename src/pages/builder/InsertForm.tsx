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
import { CopyQueryToClipboard, DownloadQuery, SubmitType, cn } from "@/lib/utils"
import { useState } from "react"

interface FormProps {
  csv: Papa.ParseResult<any> | null,
  headers: string[]
}

const formSchema = z.object({
  tablename: z.string().min(1).max(255),
  values: z.array(z.object({ column: z.string().min(1).max(32), value: z.string().min(1) })).min(1),
});

type fieldsType = z.infer<typeof formSchema>["values"];

function BuildQuery(data: any, table: string, values: fieldsType): string {
  var query = `INSERT INTO ${table} (`;

  values.map((v, index) => {
    if (index != 0) {
      query += ',';
    }
    query += `${v.column}`;
  });
  query += ') VALUES (';

  values.map((v, index) => {
    if (index != 0) {
      query += ',';
    }
    const insertValue = data[v.value];
    query += `'${insertValue}'`;
  });
  query += ');';

  return query;
}

function ParseDataFromForm(csv: Papa.ParseResult<any> | null, values: z.infer<typeof formSchema>): string {
  var query = "";
  csv?.data.map((row) => {
    const rowQuery = BuildQuery(row, values.tablename, values.values);
    query += `${rowQuery}\n`;
  });

  return query;
}

function InsertForm({ csv, headers }: FormProps) {
  const [submitType, setSubmitType] = useState<SubmitType>(SubmitType.Download);
  const [preview, setPreview] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tablename: "",
      values: [{ column: "", value: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "values",
    control: form.control
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    switch (submitType) {
      case SubmitType.Download: {
        const query = ParseDataFromForm(csv, values);
        DownloadQuery(query);
        break;
      }
      case SubmitType.Clipboard: {
        const query = ParseDataFromForm(csv, values);
        await CopyQueryToClipboard(query);
        break;
      }
      case SubmitType.Preview: {
        const q = BuildQuery(csv?.data[0], values.tablename, values.values);
        setPreview(q);
        break;
      }
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
          <Label>VALUES</Label>
          <div className="border border-dashed p-4 flex flex-col gap-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-x-8">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`values.${index}.column`}
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
                    )} />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`values.${index}.value`}
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
                    )} />
                </div>
              </div>
            ))}
            <Button type="button" size="sm" className="m-auto sm bg-background text-foreground hover:bg-background p-2" onClick={() => append({ column: "", value: "" })}><PlusCircle /></Button>
          </div>

          <div className="space-x-2 flex justify-end">
            <Popover>
              <PopoverTrigger><Button type="submit" onClick={() => setSubmitType(SubmitType.Preview)}>Preview</Button></PopoverTrigger>
              <PopoverContent className="w-[calc(100vh-10px)] bg-secondary mx-auto">{preview}</PopoverContent>
            </Popover>
            <Button type="submit" onClick={() => setSubmitType(SubmitType.Clipboard)}>Copy to Clipboard</Button>
            <Button type="submit" onClick={() => setSubmitType(SubmitType.Download)}>Download</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default InsertForm;
