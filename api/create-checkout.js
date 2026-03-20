export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { package: pkg, name, email, description, inspirationLink, fileUrls } = req.body

  if (!pkg || !name || !email || !description) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const packages = {
    starter: { name: 'Starter Package', amount: 10000 },
    growth: { name: 'Growth Package', amount: 20000 },
    pro: { name: 'Pro Package', amount: 25000 },
  }

  const selected = packages[pkg]
  if (!selected) return res.status(400).json({ error: 'Invalid package' })

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey || !stripeKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Save order to Supabase
  let orderId
  try {
    const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        package: pkg,
        name,
        email,
        description,
        inspiration_link: inspirationLink || null,
        file_urls: fileUrls || [],
        status: 'pending',
      }),
    })

    if (!orderRes.ok) {
      const err = await orderRes.text()
      console.error('Supabase error:', err)
      return res.status(500).json({ error: 'Failed to save order' })
    }

    const [order] = await orderRes.json()
    orderId = order.id
  } catch (err) {
    console.error('Order save error:', err)
    return res.status(500).json({ error: 'Failed to save order' })
  }

  // Create Stripe Checkout session
  try {
    const origin = req.headers.origin || 'https://websites-sader-carter.vercel.app'

    const params = new URLSearchParams()
    params.append('payment_method_types[0]', 'card')
    params.append('line_items[0][price_data][currency]', 'usd')
    params.append('line_items[0][price_data][product_data][name]', selected.name)
    params.append('line_items[0][price_data][product_data][description]', `603 Websites — ${selected.name}`)
    params.append('line_items[0][price_data][unit_amount]', String(selected.amount))
    params.append('line_items[0][quantity]', '1')
    params.append('mode', 'payment')
    params.append('customer_email', email)
    params.append('success_url', `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url', `${origin}/order`)
    params.append('metadata[orderId]', orderId)
    params.append('metadata[package]', pkg)
    params.append('metadata[customerName]', name)

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!stripeRes.ok) {
      const err = await stripeRes.json()
      console.error('Stripe error:', err)
      return res.status(500).json({ error: 'Failed to create payment session' })
    }

    const session = await stripeRes.json()
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe session error:', err)
    return res.status(500).json({ error: 'Failed to create payment session' })
  }
}
