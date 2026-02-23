export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, company, projectType, budgetRange, timeline, description, contactMethod, phone } = req.body

  // Validation
  if (!name || !email || !projectType || !description) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  if (description.length < 50) {
    return res.status(400).json({ error: 'Description must be at least 50 characters' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        company: company || null,
        project_type: projectType,
        budget_range: budgetRange || null,
        timeline: timeline || null,
        description,
        contact_method: contactMethod,
        phone: phone || null,
        ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
        status: 'new',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Supabase error:', errorText)
      return res.status(500).json({ error: 'Failed to save submission' })
    }

    return res.status(200).json({ success: true, message: 'Submission received' })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
