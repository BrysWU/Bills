import { useState } from 'react';
import { TextInput, NumberInput, Checkbox, DatePicker, Button, Alert } from '@mantine/core';
import api from '../api';

export default function BillForm({ onCreated, onClose }: { onCreated: (bill: any) => void, onClose: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | undefined>();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!name || !amount || !dueDate) {
      setErr('Please fill all fields');
      return;
    }
    try {
      const { data } = await api.post('/bills', {
        name, amount, dueDate, recurring
      });
      onCreated(data);
      onClose();
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Error adding bill');
    }
  };

  return (
    <>
      {err && <Alert color="red">{err}</Alert>}
      <TextInput label="Name" value={name} onChange={e => setName(e.target.value)} required mt="md" />
      <NumberInput label="Amount" value={amount} onChange={setAmount} required mt="md" precision={2} />
      <DatePicker label="Due Date" value={dueDate} onChange={setDueDate} required mt="md" />
      <Checkbox label="Monthly Recurring" checked={recurring} onChange={e => setRecurring(e.target.checked)} mt="md" />
      <Button fullWidth mt="xl" onClick={submit}>Add Bill</Button>
    </>
  );
}