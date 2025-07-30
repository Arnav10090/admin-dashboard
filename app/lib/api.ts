export async function getKpiCards() {
  const res = await fetch('/api/kpi-cards');
  if (!res.ok) throw new Error('Failed to fetch KPI cards');
  return res.json();
}

export async function getKpiCardYield(cardId: string) {
  const res = await fetch(`/api/kpi-cards/${cardId}/yield`);
  if (!res.ok) throw new Error('Failed to fetch yield');
  return res.json();
}

export async function getUserPreferences(userId: string) {
  const res = await fetch(`/api/user-preferences?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user preferences');
  return res.json();
}

export async function setUserPreferences(userId: string, layout: string, cardOrder: string) {
  const res = await fetch('/api/user-preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, layout, cardOrder }),
  });
  if (!res.ok) throw new Error('Failed to set user preferences');
  return res.json();
} 