import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Calendar } from '../Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';

export type DatePickerWithRangeProps = {
  id: string;
  /** YYYYMMDD (19921022) */
  startDate: string;
  /** YYYYMMDD (19921022) */
  endDate: string;
  /** Callback that received { startDate: string(YYYYMMDD), endDate: string(YYYYMMDD)} */
  onChange: (value: { startDate: string; endDate: string }) => void;
};

export function DatePickerWithRange({
  className,
  id,
  startDate,
  endDate,
  onChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & DatePickerWithRangeProps) {
  const [start, setStart] = React.useState<string>(
    startDate ? format(parse(startDate, 'yyyyMMdd', new Date()), 'yyyy-MM-dd') : ''
  );
  const [end, setEnd] = React.useState<string>(
    endDate ? format(parse(endDate, 'yyyyMMdd', new Date()), 'yyyy-MM-dd') : ''
  );
  const [openEnd, setOpenEnd] = React.useState(false);

  const handleStartSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setStart(formattedDate);
      setOpenEnd(true);
      onChange({
        startDate: format(selectedDate, 'yyyyMMdd'),
        endDate: end.replace(/-/g, ''),
      });
    }
  };

  const handleEndSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setEnd(formattedDate);
      setOpenEnd(false);
      onChange({
        startDate: start.replace(/-/g, ''),
        endDate: format(selectedDate, 'yyyyMMdd'),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const value = e.target.value;
    const date = parse(value, 'yyyy-MM-dd', new Date());
    if (type === 'start') {
      setStart(value);
      if (isValid(date)) {
        handleStartSelect(date);
      }
    } else {
      setEnd(value);
      if (isValid(date)) {
        handleEndSelect(date);
      }
    }
  };

  React.useEffect(() => {
    setStart(startDate ? format(parse(startDate, 'yyyyMMdd', new Date()), 'yyyy-MM-dd') : '');
    setEnd(endDate ? format(parse(endDate, 'yyyyMMdd', new Date()), 'yyyy-MM-dd') : '');
  }, [startDate, endDate]);

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          {/* ... existing code ... */}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          {/* ... existing code ... */}
        </PopoverContent>
      </Popover>

      <Popover
        open={openEnd}
        onOpenChange={setOpenEnd}
      >
        <PopoverTrigger asChild>
          {/* ... existing code ... */}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          {/* ... existing code ... */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
