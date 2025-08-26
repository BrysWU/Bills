import { useState } from 'react';
import { TextInput, NumberInput, Select, DatePicker, Button, Alert } from '@mantine/core';
import api from '../api';

export default function PaycheckForm({ onCreated, onClose }: { onCreated: (pay: any) => void, onClose: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | undefined>();
  const [type, setType] = useState<'hourly' | 'salary'>('salary');
  const [payPeriod, setPayPeriod] = useState('monthly');
  const [payday, setPayday] = useState<Date | null>(null);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!name || !amount || !payday) {
      setErr('Please fill all fields');
      return;
    }
    try {
      const { data } = await api.post('/paychecks', {
        name, amount, type, payPeriod, payday
      });
      onCreated(data);
      onClose();
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Error adding paycheck');
    }
  };

  return (
    <>
      {err && <Alert color="red">{err}</Alert>}
      <TextInput label="Name" value={name} onChange={e => setName(e.target.value)} required mt="md" />
      <NumberInput label={type === 'hourly' ? 'Hourly Rate' : 'Salary Amount'} value={amount} onChange={setAmount} required mt="md" precision={2} />
      <Select
        label="Type"
        data={[
          { value: 'salary', label: 'Salary' },
          { value: 'hourly', label: 'Hourly' },
        ]}
        value={type}
        onChange={(v) => setType(v as any)}
        mt="md"
      />
      <Select
        label="Pay Period"
        data={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'biweekly', label: 'Biweekly' },
          { value: 'weekly', label: 'Weekly' },
        ]}
        value={payPeriod}
        onChange={(v) => setPayPeriod(v!)}
        mt="md"
      />
      <DatePicker label="Next Pay Date" value={payday} onChange={setPayday} required mt="md" />
      <Button fullWidth mt="xl" onClick={submit}>Add Paycheck</Button>
    </>
  );
}