import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppShell, Navbar, Header, Button, Text } from '@mantine/core';
import { IconCalendar, IconLogout } from '@tabler/icons-react';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { getToken, removeToken } from './utils/auth';

function App() {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload.email);
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate('/login');
  };

  return (
    <AppShell
      padding="md"
      navbar={
        user && (
          <Navbar width={{ base: 200 }} p="xs">
            <Navbar.Section>
              <Button leftIcon={<IconCalendar />} variant="light" fullWidth onClick={() => navigate('/')}>
                Calendar
              </Button>
            </Navbar.Section>
            <Navbar.Section grow mt="md" />
            <Navbar.Section>
              <Button leftIcon={<IconLogout />} color="red" variant="light" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Section>
          </Navbar>
        )
      }
      header={
        <Header height={60} p="xs">
          <Text weight={700} size="xl">Bill Calendar</Text>
        </Header>
      }
    >
      <Routes>
        <Route path="/" element={user ? <CalendarPage /> : <LoginPage setUser={setUser} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
      </Routes>
    </AppShell>
  );
}

export default App;