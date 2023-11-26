import { Textarea } from "@/components/ui/textarea"
import { format } from 'sql-formatter';
import { useState } from "react";

function Formatter() {
  const [sql, setSql] = useState<string>('');
  const [formattedSQL, setFormattedSQL] = useState<string>('');

  const onChange = (value: string) => {
    setSql(value);
  };

  const formatSQL = () => {
    setFormattedSQL(format(sql, { language: 'mysql', keywordCase: 'upper' }));
  };

  const onKeyUp = () => {
    try {
      formatSQL();
    } catch(_) {

    }
  };

  return (
    <>
      <div className="flex-1 mx-auto max-w-[1500px] space-y-8 p-8 pt-4 pb-2">
        <div className="flex flex-row gap-x-4 h-[calc(100vh-100px)]">
          <Textarea value={sql} onChange={(e) => onChange(e.target.value)} onKeyUp={onKeyUp} onPaste={() => formatSQL()} id="editor" placeholder="Write your SQL here" className="resize-none" />
          <Textarea value={formattedSQL} id="formatted" readOnly placeholder="Formatted query" className="resize-none" />
        </div>
      </div>
    </>
  );
};

export default Formatter 
