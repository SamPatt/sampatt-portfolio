export async function subscribeToNewsletter(email) {
  try {
    const credentials = btoa(`${import.meta.env.VITE_LISTMONK_USERNAME}:${import.meta.env.VITE_LISTMONK_API_KEY}`);
    
    const response = await fetch('/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        email: email,
        name: '',
        status: 'enabled',
        lists: [1],  // Default list ID
        preconfirm_subscriptions: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe');
    }

    return await response.json();
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
}
