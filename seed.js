/**
 * Kroma Studio — estado inicial vacío
 * Sin métricas, publicaciones, prospectos ni hooks precargados.
 * Todo lo que se ve en la app nace del trabajo real del usuario.
 */

function buildSeed() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return {
    meta: {
      schemaVersion: 2,
      brand: 'Kroma Studio',
      handle: '@kroma.studio',
      owner: 'Kroma',
      role: 'Creative Director',
      currentMonth,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    posts: [],
    prospects: [],
    integrations: [
      {
        id: 'instagram',
        name: 'Instagram Graph',
        status: 'off',
        detail: 'No conectado · registro manual',
        icon: 'instagram',
      },
      {
        id: 'tiktok',
        name: 'TikTok Business',
        status: 'off',
        detail: 'No conectado · registro manual',
        icon: 'tiktok',
      },
      {
        id: 'ai',
        name: 'Kroma AI',
        status: 'off',
        detail: 'Plantillas locales de guion',
        icon: 'sparkles',
      },
    ],
  };
}

export { buildSeed };
