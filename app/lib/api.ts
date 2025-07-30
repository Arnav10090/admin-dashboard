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

