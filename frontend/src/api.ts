const API_URL = 'https://unpalatial-alfreda-trackable.ngrok-free.dev/api/users';

// Required for ngrok free-tier: skip the browser-warning interstitial page
const NGROK_HEADERS: HeadersInit = {
  'ngrok-skip-browser-warning': 'true',
};

export interface WifiUser {
  _id?: string;
  name: string;
  macAddress: string;
  paymentExpiryDate: string;
  amountPaid: number;
  methodPaid: string;
  status?: 'active' | 'expired';
  createdAt?: string;
}

export const fetchUsers = async (): Promise<WifiUser[]> => {
  const res = await fetch(API_URL, { headers: NGROK_HEADERS });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const createUser = async (user: Omit<WifiUser, '_id' | 'createdAt'>): Promise<WifiUser> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { ...NGROK_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: NGROK_HEADERS,
  });
  if (!res.ok) throw new Error('Failed to delete user');
};

export const updateUser = async (id: string, user: Partial<WifiUser>): Promise<WifiUser> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { ...NGROK_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
};
