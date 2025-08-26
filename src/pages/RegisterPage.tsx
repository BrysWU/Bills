import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Text, Group, Anchor, Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setToken } from '../utils/auth';

export default function RegisterPage({ setUser }: { setUser: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const { data } = await api.post('/auth/register', { email, password });
      setToken(data.token);
      setUser(email);
      navigate('/');
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md" maw={400} mx="auto">
      <Text size="lg" weight={500}>Register</Text>
      {err && <Alert color="red" mt="md">{err}</Alert>}
      <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required mt="md" />
      <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required mt="md" />
      <Button fullWidth mt="xl" onClick={submit}>Register</Button>
      <Group mt="md" position="apart">
        <Anchor onClick={() => navigate('/login')} weight={700}>Login</Anchor>
      </Group>
    </Paper>
  );
}