
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const paymentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID format'),
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  paymentMethod: z.string().min(1, 'Payment method is required').max(50),
  transactionId: z.string().min(1, 'Transaction ID is required').max(200)
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Validate input
    const body = await req.json()
    const validationResult = paymentSchema.safeParse(body)
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.issues }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const { bookingId, amount, paymentMethod, transactionId } = validationResult.data

    // Verify user is authenticated
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('service_bookings')
      .select('*, workers(*)')
      .eq('id', bookingId)
      .single()

    if (bookingError) throw bookingError

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        booking_id: bookingId,
        customer_id: booking.customer_id,
        worker_id: booking.worker_id,
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        status: 'completed'
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // Update worker's wallet
    if (booking.worker_id) {
      const workerAmount = amount * 0.85 // 85% to worker, 15% platform fee
      
      const { error: walletError } = await supabaseClient
        .from('wallets')
        .update({
          balance: supabaseClient.sql`balance + ${workerAmount}`,
          total_earned: supabaseClient.sql`total_earned + ${workerAmount}`
        })
        .eq('user_id', booking.workers.user_id)

      if (walletError) throw walletError

      // Create wallet transaction
      const { data: wallet } = await supabaseClient
        .from('wallets')
        .select('id')
        .eq('user_id', booking.workers.user_id)
        .single()

      if (wallet) {
        await supabaseClient
          .from('wallet_transactions')
          .insert({
            wallet_id: wallet.id,
            amount: workerAmount,
            type: 'credit',
            description: `Payment for service: ${booking.service_type}`,
            reference_id: bookingId
          })
      }
    }

    // Update booking status
    await supabaseClient
      .from('service_bookings')
      .update({ status: 'completed', final_cost: amount })
      .eq('id', bookingId)

    return new Response(
      JSON.stringify({ success: true, payment }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
