import { useEffect, useState } from 'react';
import { Group, Button, Modal, Table, Title, Badge, Text, Stack, Paper, Divider, Center, Loader, Alert } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconPlus, IconTrash, IconCheck } from '@tabler/icons-react';
import BillForm from '../components/BillForm';
import PaycheckForm from '../components/PaycheckForm';
import api from '../api';

interface Bill {
  _id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  paid: boolean;
}

interface Paycheck {
  _id: string;
  name: string;
  amount: number;
  type: 'hourly' | 'salary';
  payPeriod: string; // e.g., 'biweekly', 'monthly'
  payday: string;
}

export default function CalendarPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [paychecks, setPaychecks] = useState<Paycheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          api.get('/bills'),
          api.get('/paychecks'),
        ]);
        setBills(res1.data);
        setPaychecks(res2.data);
      } catch (e: any) {
        setErr(e.response?.data?.message || 'Error fetching data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const addBill = (bill: any) => setBills([...bills, bill]);
  const addPaycheck = (pay: any) => setPaychecks([...paychecks, pay]);

  const markBillPaid = async (id: string) => {
    await api.post(`/bills/${id}/paid`);
    setBills(bills.map(b => b._id === id ? { ...b, paid: true } : b));
  };

  const deleteBill = async (id: string) => {
    await api.delete(`/bills/${id}`);
    setBills(bills.filter(b => b._id !== id));
  };

  const deletePaycheck = async (id: string) => {
    await api.delete(`/paychecks/${id}`);
    setPaychecks(paychecks.filter(p => p._id !== id));
  };

  const monthlyBillsTotal = bills
    .filter(b => !b.paid)
    .reduce((sum, b) => sum + b.amount, 0);

  const monthlyPayTotal = paychecks.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Stack>
      <Group position="apart">
        <Title order={2}>Calendar</Title>
        <Group>
          <Button leftIcon={<IconPlus />} onClick={() => setShowBillModal(true)}>Add Bill</Button>
          <Button leftIcon={<IconPlus />} color="green" onClick={() => setShowPayModal(true)}>Add Paycheck</Button>
        </Group>
      </Group>
      <Divider />
      {err && <Alert color="red">{err}</Alert>}
      {loading ? (
        <Center><Loader /></Center>
      ) : (
        <Group align="flex-start" grow>
          <Paper shadow="sm" p="md">
            <Calendar value={selectedDate} onChange={setSelectedDate} />
          </Paper>
          <Stack>
            <Title order={4}>Monthly Summary</Title>
            <Text>Total Bills: <Badge color="red">${monthlyBillsTotal.toFixed(2)}</Badge></Text>
            <Text>Total Bring-home Pay: <Badge color="green">${(monthlyPayTotal - monthlyBillsTotal).toFixed(2)}</Badge></Text>
            <Divider my="sm" />
            <Title order={4}>Bills</Title>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Due</th>
                  <th>Recurring</th>
                  <th>Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill._id} style={bill.paid ? { textDecoration: 'line-through', opacity: 0.5 } : {}}>
                    <td>{bill.name}</td>
                    <td>${bill.amount.toFixed(2)}</td>
                    <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td>{bill.recurring ? <Badge color="blue">Monthly</Badge> : '-'}</td>
                    <td>{bill.paid ? <Badge color="green">Paid</Badge> : <Badge color="red">Unpaid</Badge>}</td>
                    <td>
                      {!bill.paid && (
                        <Button size="xs" leftIcon={<IconCheck />} color="green" onClick={() => markBillPaid(bill._id)}>
                          Mark Paid
                        </Button>
                      )}
                      <Button size="xs" leftIcon={<IconTrash />} color="red" onClick={() => deleteBill(bill._id)} ml="xs">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Divider my="sm" />
            <Title order={4}>Paychecks</Title>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Pay Period</th>
                  <th>Payday</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paychecks.map(pay => (
                  <tr key={pay._id}>
                    <td>{pay.name}</td>
                    <td>${pay.amount.toFixed(2)}</td>
                    <td><Badge color={pay.type === 'hourly' ? 'yellow' : 'blue'}>{pay.type}</Badge></td>
                    <td>{pay.payPeriod}</td>
                    <td>{new Date(pay.payday).toLocaleDateString()}</td>
                    <td>
                      <Button size="xs" leftIcon={<IconTrash />} color="red" onClick={() => deletePaycheck(pay._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Stack>
        </Group>
      )}
      <Modal opened={showBillModal} onClose={() => setShowBillModal(false)} title="Add Bill">
        <BillForm onCreated={addBill} onClose={() => setShowBillModal(false)} />
      </Modal>
      <Modal opened={showPayModal} onClose={() => setShowPayModal(false)} title="Add Paycheck">
        <PaycheckForm onCreated={addPaycheck} onClose={() => setShowPayModal(false)} />
      </Modal>
    </Stack>
  );
}